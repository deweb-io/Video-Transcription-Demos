const speech = require('@google-cloud/speech').v1p1beta1;
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync('./service-account-bbsnetwork-dev.json', 'utf8'));

// Creates a client
const client = new speech.SpeechClient({credentials});

async function transcribe(file, outputPath, encoding, sampleRateHertz, languageCode, model) {
    // this config is a must - so need a way to get info on the file(encoding, sampleRateHertz, languageCode) 
    const config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
        enableAutomaticPunctuation: true,
        model: model,
    };
    const audio = {
        content: fs.readFileSync(file).toString('base64'),
    };

    const request = {
        config: config,
        audio: audio,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
    fs.writeFileSync(outputPath, transcription);
}

module.exports = {
    transcribe
}
