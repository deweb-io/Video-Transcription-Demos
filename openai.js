const {Configuration, OpenAIApi} = require('openai');
const fs = require('fs');
const Readable = require('stream').Readable;

const apiKey = fs.readFileSync('openai_key.text', 'utf-8').trimEnd();

async function transcribeFilePath(file, outputPath, format='text') {
  try {
        let openai = new OpenAIApi(new Configuration({apiKey}));
        const transcription = await openai.createTranscription(
            fs.createReadStream(file), 'whisper-1', undefined, format, undefined, undefined, 
            {maxBodyLength: 25 * 1024 * 1024}); // maxBodyLength - axios config to be able to work with files up to 25MB (maximum size for whispher).
        console.log(transcription);
        fs.appendFileSync(outputPath, format == 'text' || format === 'srt' ? transcription.data : transcription);
    } catch(err) {
        console.error('error!' + err.message)
    }
}

// file type is needed for open ai - not sure we need to pass the correct one, but it must be supported.
async function transcribeBuffer(buffer, outputPath, fileType='mp4', format='srt') {
    try {
          // https://github.com/openai/openai-node/issues/77
          const audioReadStream = Readable.from(buffer);
          audioReadStream.path = `file.${fileType}`;
          let openai = new OpenAIApi(new Configuration({apiKey}));
          const transcription = await openai.createTranscription(
            audioReadStream, 'whisper-1', undefined, format, undefined, undefined, 
              {maxBodyLength: 25 * 1024 * 1024}); // maxBodyLength - axios config to be able to work with files up to 25MB (maximum size for whispher).
          console.log(transcription);
          fs.appendFileSync(outputPath, format == 'text' || format === 'srt' ? transcription.data : transcription);
      } catch(err) {
          console.error('error!' + err.message)
      }
  }

async function processDebate(transcriptArray, debateName) {
    const debatesDir = 'debates';
    const now = Date.now();
    const outputFile = `${debatesDir}/${debateName}_${now}.txt`;
    let openai = new OpenAIApi(new Configuration({apiKey}));

    let conversation = [
        {"role": "system", "content": "You are a helpful assistant. In this conversation i need your help to anazlyze a debate. For each part of the debate, please find contradictions, logical fallacies or evasions compare to the other side's arguments. Please ensure your response is up to 100 words."},
        {"role": "user", "content": `The first part of the debate belongs to ${transcriptArray[0].debater}:  "${transcriptArray[0].text}".`}
    ];

    const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: conversation
        }
    );

    let prevDebaterAnalysis = response.data['choices'][0]['message']['content'];
    fs.appendFileSync(outputFile, `---${transcriptArray[0].debater}'s analysis---\n${prevDebaterAnalysis}\n\n`);

    transcriptArray = transcriptArray.slice(1,);

    for (const transcript of transcriptArray) {
        let conversation = [
            {"role": "system", "content": "You are a helpful assistant. For each part of the debate, please find contradictions, logical fallacies or evasions compare to the other side's arguments. Please ensure your response is up to 100 words."},
            {"role": "user", "content": `This is your summary of previous debater's talk: "${prevDebaterAnalysis}". ${transcript.debater}'s response:  ${transcript.text}.`}
        ];

        const response = await openai.createChatCompletion({
                model: "gpt-4",
                messages: conversation
            }
        );

        prevDebaterAnalysis = response.data['choices'][0]['message']['content'];
        fs.appendFileSync(outputFile, `---${transcriptArray[0].debater}'s analysis---\n${prevDebaterAnalysis}\n\n`);
    }

}

module.exports = {
    transcribeFilePath,
    transcribeBuffer,
    processDebate
}
