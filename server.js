import NodeMediaServer from "node-media-server";
import nmsConfig from "./config/mediaServer.js";
import Channel from "./models/channelModel.js";
import ffmpeg from "fluent-ffmpeg";
import lodash from "lodash";

let channelArray = [];
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
findChannel();

const nms = new NodeMediaServer(nmsConfig);

let config = nmsConfig;

nms.run();

nms.on("prePublish", async (id, StreamPath, args) => {
  // const isValidStreamKey = channelArray.includes(StreamPath);

  // if (!isValidStreamKey) {
  //   const session = nms.getSession(id);
  //   session.reject();
  // }
});

nms.on("postPublish", async (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on postPublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
  console.log(
    "------------------------------donePublish---------------------------------"
  );

     console.log("AKI", StreamPath);
     let regRes = /\/(.*)\/(.*)/gi.exec(StreamPath);

     console.log("----------------------------------AKI--------")
     console.log(regRes);


     let [app, stream] = lodash.slice(regRes, 1);
console.log("----------------------------------APP , STREAM --------");
      console.log("app", app);
      console.log("Stream", stream);








});

nms.on("donePublish", (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on donePublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );

 
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
