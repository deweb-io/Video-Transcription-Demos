const fs = require('fs');

const {Storage} = require('@google-cloud/storage');

const openai = require('./openai');
const googleVideoIntelligence = require('./google_video_intelligence')
const googleSpeechToText = require('./google_speech_to_text');

const mediaDir = 'media';
const outputDir = 'output';

try {
  fs.mkdirSync(outputDir);
} catch(err) {};


async function getFileFromStorage(file, mediaType) {
  const storage = new Storage({keyFilename: 'service-account-creatoreco-stage.json'});
  const bucketName = 'creator-eco-stage.appspot.com';
  const fileObject = storage.bucket(bucketName).file(`media/${file}`);
  const type = (await fileObject.getMetadata())[0]['contentType'].split('/')[1];

  // Downloads the file into a buffer in memory.
  const bufferArray = await fileObject.download();
  const name = `media/${mediaType}/${file}.${type != 'x-m4a' ? type : 'm4a'}`;
  fs.writeFileSync(name, bufferArray[0]);
  console.log(`wrote file:${name}`);

  return name;
}

async function openaiWhisperLocal() {
  const file = '0ctZiGonbQRmd0sYy1bV.mp4';
  const mediaFile = `${mediaDir}/video/${file}`;
  console.log(`will transcribe: ${mediaFile}`);
  const format = 'srt';
  await openai.transcribe(mediaFile, `${outputDir}/openai_${file.split('.')[0]}_${file.split('.')[1]}.${format}`, format);
}

async function openaiWhisperStorage() {
  const file = '0s4OAgEzcBPm0HfrH2B1';
  const mediaFile = await getFileFromStorage(file, 'audio');
  console.log(`will transcribe: ${mediaFile}`);
  const format = 'srt';
  await openai.transcribe(mediaFile, `${outputDir}/openai_${file.split('.')[0]}_${file.split('.')[1]}.${format}`, format);
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

  // await workWithStorage()

  await openaiWhisperStorage();
  // googleSpeech();
  // googleVideoInt();
}

main();
