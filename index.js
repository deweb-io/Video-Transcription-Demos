const fs = require('fs');

const {Storage} = require('@google-cloud/storage');

const openai = require('./openai');
const googleVideoIntelligence = require('./google_video_intelligence')
const googleSpeechToText = require('./google_speech_to_text');

const mediaDir = 'media';
const outputDir = 'output';
const debatesDir = 'debates';

try {
  fs.mkdirSync(outputDir);
} catch(err) {};


async function getBufferFileFromStorage(file) {
  const storage = new Storage({keyFilename: 'service-account-creatoreco-stage.json'});
  const bucketName = 'creator-eco-stage.appspot.com';
  const fileObject = storage.bucket(bucketName).file(`media/${file}`);

  // Downloads the file into a buffer in memory.
  const bufferArray = await fileObject.download();
  return bufferArray[0];
}

async function openaiWhisperLocal() {
  const file = 'ben_vs_anna_debate.m4a';
  const mediaFile = `${mediaDir}/audio/${file}`;
  console.log(`will transcribe: ${mediaFile}`);
  const format = 'srt';
  await openai.transcribeFilePath(mediaFile, `${outputDir}/openai_${file.split('.')[0]}_${file.split('.')[1]}.${format}`, format);
}

// This function demonstrates a real usage on google cloud function.
async function openaiWhisperStorage() {
  const file = '0ctZiGonbQRmd0sYy1bV';
  const buffer = await getBufferFileFromStorage(file);
  console.log(`will transcribe: ${file} from storage`);
  const format = 'text';
  await openai.transcribeBuffer(buffer, `${outputDir}/openai_${file.split('.')[0]}_${file.split('.')[1]}.${format}`, 'm4a', format);
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

async function processDebate() {
  const debateName = 'ben_vs_anna_debate_2';
  const transcriptArray = [
    {'debater': 'Anna',
      'text' : fs.readFileSync(`${debatesDir}/ben_vs_anna/debate_2/anna_1.txt`)}, 
      {'debater': 'Ben',
      'text' : fs.readFileSync(`${debatesDir}/ben_vs_anna/debate_2/ben_1.txt`)},
      {'debater': 'Anna',
      'text' : fs.readFileSync(`${debatesDir}/ben_vs_anna/debate_2/anna_2.txt`)},
      {'debater': 'Ben',
        'text' : fs.readFileSync(`${debatesDir}/ben_vs_anna/debate_2/ben_2.txt`)},
  ]
  await openai.processDebate(transcriptArray, debateName);

}

async function main() {
  await processDebate();
  // await openaiWhisperLocal();
  // await openaiWhisperStorage();
  // googleSpeech();
  // googleVideoInt();
}

main();
