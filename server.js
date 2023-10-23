import NodeMediaServer from "node-media-server";
import nmsConfig from "./config/mediaServer.js";
import Channel from "./models/channelModel.js";

let channelArray = [];
 export const findChannel = async()=>{
  try{
   const channel = await Channel.find();
      channelArray = channel.map((data)=>{return data.streamKey})
  }catch(err)
  {
     console.log(err);
  }
}
findChannel();

const nms = new NodeMediaServer(nmsConfig)

let config = nmsConfig;

nms.run();

 
nms.on('prePublish', async (id, StreamPath, args) => {
  const isValidStreamKey = channelArray.includes(StreamPath)
  
  if (!isValidStreamKey) {
    const session = nms.getSession(id);
    session.reject();
  }
});

nms.on("postPublish", (id, StreamPath, args) => {

  console.log('...............................this is post publish............................................', this)
   if (!config.relay.tasks) {
     return;
   }
   console.log("AKI", StreamPath);
   let regRes = /\/(.*)\/(.*)/gi.exec(StreamPath);
   let [app, stream] = _.slice(regRes, 1);
   console.log(stream);
   let i = config.relay.tasks.length;
   while (i--) {
     let conf = config.relay.tasks[i];
     let isPush = conf.mode === "push";
     if (isPush && app === conf.app) {
       let hasApp = conf.edge.match(/rtmp:\/\/([^\/]+)\/([^\/]+)/);
       conf.ffmpeg = config.relay.ffmpeg;
       conf.inPath = `rtmp://127.0.0.1:${config.rtmp.port}${StreamPath}`;
       conf.ouPath = hasApp ? `${conf.edge}` : `${conf.edge}`;
       let session = new NodeRelaySession(conf);
       session.id = id;
       session.on("end", (id) => {
         dynamicSessions.delete(id);
       });
       dynamicSessions.set(id, session);
       session.run();
       Logger.log(
         "[Relay dynamic push] start",
         id,
         conf.inPath,
         " to ",
         conf.ouPath
       );
     }
   }
});

// nms.on("donePublish", (id, StreamPath, args) => {
//   console.log(
//     "[NodeEvent on donePublish]",
//     `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
//   );
// });

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
