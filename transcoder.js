const fs = require('fs');

const { TranscoderServiceClient } = require('@google-cloud/video-transcoder').v1;

const credentials = JSON.parse(fs.readFileSync('./service-account-bbsnetwork-dev.json', 'utf8'));

const transcoder = new TranscoderServiceClient({credentials});

const projectId='bbsnetwork-dev';
const location='us-central1';

const request = {
    parent: transcoder.locationPath(projectId, location),
    // video and audio
    // job: {
    //     inputUri: 'gs://bbsnetwork-dev.appspot.com/Aq3wiqFAucK0AG10sdyl.mp4',
    //     config: {
    //       elementaryStreams: [
    //         {
    //           key: 'video-stream1',
    //           videoStream: {
    //             h264: {
    //               bitrateBps: 2000000,
    //               frameRate: 60
    //             }
    //           }
    //         },
    //         {
    //             'key': 'audio-stream1',
    //             'audioStream': {
    //             'bitrateBps': 128000,
    //             'codec': 'mp3',
    //         }
    //         }
    //       ],
    //       muxStreams: [
    //         {
    //           fileName: 'Aq3wiqFAucK0AG10sdyl.mp4',
    //           key: 'hd',
    //           container: 'mp4',
    //           elementaryStreams: ['video-stream1', 'audio-stream1']
    //         },
    //         {
              
    //             'fileName': 'Aq3wiqFAucK0AG10sdyl.mp3',
    //             'key': 'audio-mp3',
    //             'container': 'mp4',
    //             'elementaryStreams': ['audio-stream1']
              
    //         }
    //       ],
    //       spriteSheets: [
    //         {
    //           filePrefix: 'Aq3wiqFAucK0AG10sdyl.mp4',
    //           spriteWidthPixels: 512,
    //           columnCount: 1,
    //           rowCount: 1,
    //           totalCount: 1
    //         }
    //       ],
    //       output: {
    //         uri: 'gs://bbsnetwork-dev.appspot.com/transcoder/'
    //       }
    //     }
    //   }
    
    // video and audio based on backend code
    job: {
        inputUri: `gs://bbsnetwork-dev.appspot.com/Aq3wiqFAucK0AG10sdyl.mp4`,
        config: {
            elementaryStreams: [
                {
                    key: 'video-stream1',
                    videoStream: {
                        h264: {
                            bitrateBps: 2000000,
                            frameRate: 60,
                            // enableTwoPass: true
                        },
                    }
                },
                {
                    key: 'audio-stream1',
                    audioStream: {
                        bitrateBps: 128000, // 128kbps
                        codec: 'mp3',
                    }
            }
            ],
            muxStreams: [
                {
                    fileName: 'Aq3wiqFAucK0AG10sdyl',
                    key: 'hd',
                    container: 'mp4',
                    elementaryStreams: ['video-stream1', 'audio-stream1'],
                },
                {
                    fileName: 'Aq3wiqFAucK0AG10sdyl-audio-mp3.mp4',
                    key: 'audio-mp3',
                    container: 'mp4',
                    elementaryStreams: ['audio-stream1']  
                }
            ],
            spriteSheets: [
                {
                    // filePrefix: postId,
                    // spriteHeightPixels: 512,
                    spriteWidthPixels: 512,
                    columnCount: 1,
                    rowCount: 1,
                    totalCount: 1,
                }
            ],
            output: {
                uri: `gs://bbsnetwork-dev.appspot.com/transcoder/`
            },
        }
    },
};

async function main() {
    const [response] = await transcoder.createJob(request);
    console.log(response);

    // async function listJobs() {
    // const [jobs] = await transcoder.listJobs({
    //     parent: transcoder.locationPath(projectId, location),
    // });
    // console.info('jobs:');
    // for (const job of jobs) {
    //     console.info(job);
    // }
    // }
    // listJobs();
}

main();
