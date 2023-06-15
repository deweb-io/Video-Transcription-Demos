const openai = require('./openai');
const googleVideoIntelligence = require('./google_video_intelligence')

async function main() {
  // openai
  const audioFile = 'english_audio.mp3';
  await openai.transcribe(audioFile);

  // google videp intelligence
  const gcsUri = 'gs://bbsnetwork-dev.appspot.com/Aq3wiqFAucK0AG10sdyl.mp4';
  await googleVideoIntelligence.transcribe(gcsUri);
}

main();
