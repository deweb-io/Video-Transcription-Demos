const fs = require('fs');

const openai = require('./openai');
const googleVideoIntelligence = require('./google_video_intelligence')
const googleSpeechToText = require('./google_speech_to_text');

const mediaDir = 'media';
const outputDir = 'output';

try {
  fs.mkdirSync(outputDir);
} catch(err) {};


async function openaiWhisper() {
  const audioFile = `${mediaDir}/english_audio.mp3`;
  const format = 'srt';
  await openai.transcribe(audioFile, `${outputDir}/openai_${format}.text`, format);
}

async function googleSpeech() {
  // google speech to text
  const audioFile = `${mediaDir}/english_audio.mp3`;
  const format = 'text';
  await googleSpeechToText.transcribe(audioFile, `${outputDir}/google_speech_${format}.text`, 'MP3', 44100, 'en-US', 'video');
}

async function googleVideoInt() {
  // google videp intelligence
  const gcsUri = 'gs://bbsnetwork-dev.appspot.com/Aq3wiqFAucK0AG10sdyl.mp4';
  const format = 'text';
  await googleVideoIntelligence.transcribe(gcsUri, `${outputDir}/google_video_intelligence_${format}.text`);
}

async function main() {
  // openaiWhisper();
  // googleSpeech();
  // googleVideoInt();
}

main();
