const {Configuration, OpenAIApi} = require('openai');
const fs = require('fs');

const apiKey = fs.readFileSync('openai_key.text', 'utf-8').trimEnd();

async function transcribe(file, outputPath, format='text') {
  try {
        let openai = new OpenAIApi(new Configuration({apiKey}));
        const transcription = await openai.createTranscription(fs.createReadStream(file), 'whisper-1', undefined, format);
        fs.appendFileSync(outputPath, format == 'text' || format === 'srt' ? transcription.data : transcription);
    } catch(err) {
        console.error('error!' + err.message)
    }
}

module.exports = {
    transcribe
}
