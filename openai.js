const {Configuration, OpenAIApi} = require('openai');
const fs = require('fs');

const apiKey = fs.readFileSync('openai_key.text', 'utf-8').trimEnd();

async function transcribe(file, outputPath, format='text') {
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

module.exports = {
    transcribe
}
