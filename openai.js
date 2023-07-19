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


module.exports = {
    transcribeFilePath,
    transcribeBuffer
}
