import NodeMediaServer from "node-media-server";
import nmsConfig from "./config/mediaServer.js";
import Channel from "./models/channelModel.js";
import ffmpeg from "fluent-ffmpeg";
import lodash from "lodash";
import Logger from "Logger";
import App from "./models/appModel.js";
import User from "./models/userModel.js";
import { getDate } from "./config/getDate.js";

let channelArray = [];
let transTasksArray = [];

export const findChannel = async () => {
  try {
    const channel = await Channel.find();
    channelArray = channel.map((data) => {
      return data.streamKey;
    });
  } catch (err) {
    console.log(err);
  }
};
await findChannel();

const loadConfig = async () => {
  const tasks = await App.findOne({});
  let number;
  let name
  if(!tasks){
   transTasksArray.push({
     app: "live1",
     hls: true,
     hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
     hlsKeep: true,
     dash: true,
     dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
     dashKeep: true,
     mp4: true,
     mp4Flags: "[movflags=frag_keyframe+empty_moov]",
   });
   return
  }
  number = tasks.number
 
  for (let i = 1; i <= number; i++) {
    transTasksArray.push({
      app: tasks.name + i,
      hls: true,
      hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
      hlsKeep: true,
      dash: true,
      dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
      dashKeep: true,
      mp4: true,
      mp4Flags: "[movflags=frag_keyframe+empty_moov]",
    });
  }
};

await loadConfig();

const nms = new NodeMediaServer({
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    webroot: "./public",
    mediaroot: "./media",
    allow_origin: "*",
  },
  https: {
    port: 8443,
    key: "./privatekey.pem",
    cert: "./certificate.pem",
    allow_origin: "*",
  },
  trans: {
    ffmpeg: "/usr/bin/ffmpeg",
    tasks: transTasksArray,
  },
  relay: {
    ffmpeg: "/usr/bin/ffmpeg",
    tasks: [
      {
        app: "live",
        mode: "push",
        edge: "rtmp://a.rtmp.youtube.com/live2/xfjz-7f48-q5we-azx7-6q2d",
        appendName: false,
        rtsp_transport: "tcp",
      },
      {
        app: "live2",
        mode: "push",
        edge: "rtmp://a.rtmp.youtube.com/live2/kaxt-pds9-y6ss-vas1-4bg7",
        appendName: false,
        rtsp_transport: "tcp",
      },
    ],
  },
});

nms.run();

nms.on("prePublish", async (id, StreamPath, args) => {
  const isValidStreamKey = channelArray.includes(StreamPath)

  if(!isValidStreamKey){
     const session = nms.getSession(id);
     return session.reject();
  }

  const channel = await Channel.findOne({ streamKey: StreamPath })

  const user = await User.findById({_id:channel.userId})

  if(!user.isActive ){
     const session = nms.getSession(id);
    return session.reject();
  }




  const startTime =  getDate()

  console.log('start-time',startTime);

  await Channel.findOneAndUpdate(
    { streamKey: StreamPath },
    { $set: { status: true, startTime: startTime } },
    { new: true, multi: true }
  );

});

nms.on("postPublish", async (id, StreamPath, args) => {




});







nms.on("donePublish", async (id, StreamPath, args) => {
  console.log('------------------------------------DonePublish------------------------------------')
  await Channel.findOneAndUpdate(
    { streamKey: StreamPath },
    { $set: { status: false, startTime: null } },
    { new: true ,multi:true}
  ).then((data)=>console.log(data))

});

// nms.on("prePlay", (id, StreamPath, args) => {
//   console.log(
//     "[NodeEvent on prePlay]",
//     `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
//   );
//   // let session = nms.getSession(id);
//   // session.reject();
// });

// nms.on("postPlay", (id, StreamPath, args) => {
//   console.log(
//     "[NodeEvent on postPlay]",
//     `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
//   );
// });

// nms.on("donePlay", (id, StreamPath, args) => {
//   console.log(
//     "[NodeEvent on donePlay]",
//     `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
//   );
// });



export default nms