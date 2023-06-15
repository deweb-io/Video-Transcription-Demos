const {Configuration, OpenAIApi} = require('openai');
const fs = require('fs');

const apiKey = fs.readFileSync('openai_key.text','utf-8');

async function transcribe(file) {
  try {
    let openai = new OpenAIApi(new Configuration({apiKey}));

    const transcription = await openai.createTranscription(fs.createReadStream(file), 'whisper-1', undefined, 'srt');

    fs.writeFileSync('openai_english_audio.txt', transcription.data)
    } catch(err) {
        console.error('error!' + err.message)
    }
}

module.exports = {
    transcribe
}
