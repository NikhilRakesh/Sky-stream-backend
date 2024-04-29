import NodeMediaServer from "node-media-server";
import Channel from "./models/channelModel.js";
import App from "./models/appModel.js";
import User from "./models/userModel.js";
import Eadge from "./models/eadgeModel.js";
import { streamKeys } from "./index.js";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import fse from "fs-extra";
import rtmp from 'rtmp-stream';
import { exec } from 'child_process';


// const nms = new NodeMediaServer({
//   rtmp: {
//     port: 1935,
//     chunk_size: 60000,
//     gop_cache: true,
//     ping: 60,
//     ping_timeout: 120,
//   },
//   http: {
//     port: 8000,
//     webroot: "./public",
//     mediaroot: "./media",
//     allow_origin: "*",
//   },
//   https: {
//     port: 8443,
//     key: "./privatekey.pem",
//     cert: "./certificate.pem",
//     allow_origin: "*",
//   },
//   trans: {
//     ffmpeg: "/usr/bin/ffmpeg",
//     tasks: [
//       {
//         app: "live",
//         hls: true,
//         hlsFlags: "[hls_time=3:hls_list_size=6:hls_flags=delete_segments]",
//         hlsKeep: false, // to prevent hls file delete after end the stream
//         dash: true,
//         dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
//         dashKeep: true,
//       },
//       {
//         app: "live6",
//         hls: true,
//         hlsFlags: "[hls_time=3:hls_list_size=6:hls_flags=delete_segments]",
//         hlsKeep: false, // to prevent hls file delete after end the stream
//         dash: true,
//         dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
//         dashKeep: true,
//       },
//       {
//         app: "live4",
//         hls: true,
//         hlsFlags: "[hls_time=3:hls_list_size=6:hls_flags=delete_segments]",
//         hlsKeep: false, // to prevent hls file delete after end the stream
//         dash: true,
//         dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
//         dashKeep: true,
//       },
//       {
//         app: "live8",
//         hls: true,
//         hlsFlags: "[hls_time=3:hls_list_size=6:hls_flags=delete_segments]",
//         hlsKeep: false, // to prevent hls file delete after end the stream
//         dash: true,
//         dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
//         dashKeep: true,
//       },
//     ],
//   },
//   relay: {
//     ffmpeg: "/usr/bin/ffmpeg",
//     tasks: [],
//   },
//   auth: {
//     api: true,
//     api_user: "codenuity",
//     api_pass: "codenuity",
//   },
//   fission: {
//     ffmpeg: "/usr/bin/ffmpeg",
//     tasks: [
//       {
//         rule: "live/",
//         model: [
//           {
//             ab: "128k",
//             vb: "1500k",
//             vs: "720x1280",
//             vf: "30",
//           },
//           {
//             ab: "64k",
//             vb: "1000k",
//             vs: "480x854",
//             vf: "24",
//           },
//           {
//             ab: "32k",
//             vb: "600k",
//             vs: "360x640",
//             vf: "20",
//           },
//         ],
//       },
//       {
//         rule: "live6/",
//         model: [
//           {
//             ab: "128k",
//             vb: "1500k",
//             vs: "720x1280",
//             vf: "30",
//           },
//           {
//             ab: "64k",
//             vb: "1000k",
//             vs: "480x854",
//             vf: "24",
//           },
//           {
//             ab: "32k",
//             vb: "600k",
//             vs: "360x640",
//             vf: "20",
//           },
//         ],
//       },
//       {
//         rule: "live4/",
//         model: [
//           {
//             ab: "128k",
//             vb: "1500k",
//             vs: "720x1280",
//             vf: "30",
//           },
//           {
//             ab: "64k",
//             vb: "1000k",
//             vs: "480x854",
//             vf: "24",
//           },
//           {
//             ab: "32k",
//             vb: "600k",
//             vs: "360x640",
//             vf: "20",
//           },
//         ],
//       },
//       {
//         rule: "live8/",
//         model: [
//           {
//             ab: "128k",
//             vb: "1500k",
//             vs: "720x1280",
//             vf: "30",
//           },
//           {
//             ab: "64k",
//             vb: "1000k",
//             vs: "480x854",
//             vf: "24",
//           },
//           {
//             ab: "32k",
//             vb: "600k",
//             vs: "360x640",
//             vf: "20",
//           },
//         ],
//       },
//     ],
//   },
// });

// nms.on("prePublish", async (id, StreamPath, args) => {
//   const isValidStreamKey = streamKeys.includes(StreamPath);

//   console.log("isValidStreamKey", isValidStreamKey);
//   console.log("StreamPath", StreamPath);

//   if (!isValidStreamKey) {
//     const session = nms.getSession(id);
//     return session.reject();
//   }

//   const channel = await Channel.findOne({ streamKey: StreamPath });
//   const user = await User.findById(channel.userId);

//   if (!user.isActive) {
//     const session = nms.getSession(id);
//     return session.reject();
//   }

//   await Channel.findOneAndUpdate(
//     { streamKey: StreamPath },
//     { $set: { status: true, startTime: new Date(Date.now()), sessionId: id } },
//     { new: true, multi: true }
//   );

//   await User.findOneAndUpdate(
//     user._id,
//     { $set: { status: true } },
//     { new: true }
//   );
// });

// nms.on("donePublish", async (id, StreamPath, args) => {
//   const channel = await Channel.findOne({ streamKey: StreamPath });
//   const user = await User.findById(channel.userId);
//   const folderPath = path.join(parentDir, `./media${data.streamKey}`);
//   await fse.emptyDir(folderPath);

//   await fs.rmdir(folderPath, { recursive: true }, (err) => {
//     if (err) {
//       console.error("Error deleting folder:", err);
//     } else {
//       console.log("Folder deleted successfully");
//     }
//   });

//   await Channel.findOneAndUpdate(
//     { streamKey: StreamPath },
//     { $set: { status: false, startTime: null } },
//     { new: true, multi: true }
//   );

//   await User.findOneAndUpdate(
//     user._id,
//     { $set: { status: false } },
//     { new: true }
//   );
// });

const createFFmpegProcess = (StreamPath) => {

    const ffmpegCommand = `ffmpeg -i rtmp://localhost:1935${StreamPath} -c copy -f flv rtmp://localhost:1936${StreamPath}`;

    const ffmpegProcess = exec(ffmpegCommand, (error, stdout, stderr) => {
        console.log("entered in sid ethe the ");
        if (error) {
            console.error(`Error executing FFmpeg command: ${error}`);
            return;
        }
        console.log(`Redirected stream ${StreamPath} to SRS container at port 1936`);
    });

    // Attach cleanup function to remove event listeners and kill process
    const cleanup = () => {
        console.log('Cleaning up FFmpeg process');
        ffmpegProcess.kill('SIGTERM');
        ffmpegProcess.removeAllListeners();
    };

    // Listen for exit event to trigger cleanup
    ffmpegProcess.on('exit', (code, signal) => {
        console.log('FFmpeg process exited with code', code);
        cleanup();
    });

    return cleanup;
};

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30,
    }
};

const nms = new NodeMediaServer(config);

const cleanupFunctions = new Map();

nms.on('prePublish', (id, StreamPath, args) => {

    try {
        const isValidStreamKey = streamKeys.includes(StreamPath);
        if (!isValidStreamKey) {
            console.log(`Unauthorized access attempt: Stream key "${StreamPath}" is invalid.`);
            const session = nms.getSession(id);
            return session.reject();
        }

        // Create FFmpeg process and get cleanup function
        const cleanupFFmpegProcess = createFFmpegProcess(StreamPath);

        cleanupFunctions.set(StreamPath, cleanupFFmpegProcess);

    } catch (err) {  
        console.error('Error occurred during stream key validation:', err);
        const session = nms.getSession(id);
        session.reject();
    }

    nms.on('donePublish', (id, StreamPath) => {
        const cleanupFunction = cleanupFunctions.get(StreamPath);
        if (cleanupFunction) {
            console.log(`Cleaning up FFmpeg process for stream ${StreamPath}`);
            cleanupFunction();
            cleanupFunctions.delete(StreamPath);
        }
    });

});

export default nms;  
