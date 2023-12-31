const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

// Run FFmpeg
ffmpeg()

  // Input file
  .input('Aq3wiqFAucK0AG10sdyl.mp4')

  // Audio bit rate
  .outputOptions('-ab', '192k')

  // Output file
  .saveToFile('audio.mp3')

  // Log the percentage of work completed
  .on('progress', (progress) => {
    if (progress.percent) {
      console.log(`Processing: ${Math.floor(progress.percent)}% done`);
    }
  })

  // The callback that is run when FFmpeg is finished
  .on('end', () => {
    console.log('FFmpeg has finished.');
  })

  // The callback that is run when FFmpeg encountered an error
  .on('error', (error) => {
    console.error(error);
  });
