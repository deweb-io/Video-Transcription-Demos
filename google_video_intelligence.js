const fs = require('fs');

// Imports the Google Cloud Video Intelligence library
const videoIntelligence = require('@google-cloud/video-intelligence');

const credentials = JSON.parse(fs.readFileSync('./service-account-bbsnetwork-dev.json', 'utf8'));

// Creates a client
const client = new videoIntelligence.VideoIntelligenceServiceClient({credentials});

async function analyzeVideoTranscript(video) {
  const videoContext = {
    speechTranscriptionConfig: {
      max_alternatives: 1,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
    },
  };

  const request = {
    inputUri: video,
    features: ['SPEECH_TRANSCRIPTION'],
    videoContext: videoContext,
  };

  fs.rmSync('google_video_intelligence.text');

  const [operation] = await client.annotateVideo(request);
  console.log('Waiting for operation to complete...');
  const [operationResult] = await operation.promise();
  // There is only one annotation_result since only
  // one video is processed.
  const annotationResults = operationResult.annotationResults[0];

  for (const speechTranscription of annotationResults.speechTranscriptions) {
    // The number of alternatives for each transcription is limited by
    // SpeechTranscriptionConfig.max_alternatives.
    // Each alternative is a different possible transcription
    // and has its own confidence score.
    for (const alternative of speechTranscription.alternatives) {
      console.log('Alternative level information:');
      console.log(`Transcript: ${alternative.transcript}`);

      fs.appendFileSync('google_video_intelligence.text', alternative.transcript);

      console.log(`Confidence: ${alternative.confidence}`);
      console.log('Word level information:');
      for (const wordInfo of alternative.words) {
        const word = wordInfo.word;
        const start_time =
          wordInfo.startTime.seconds + wordInfo.startTime.nanos * 1e-9;
        const end_time =
          wordInfo.endTime.seconds + wordInfo.endTime.nanos * 1e-9;
        console.log('\t' + start_time + 's - ' + end_time + 's: ' + word);
      }
    }
  }
}

module.exports = {
    transcribe: analyzeVideoTranscript
}
