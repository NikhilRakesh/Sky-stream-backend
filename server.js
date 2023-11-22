import NodeMediaServer from "node-media-server";
import Channel from "./models/channelModel.js";
import App from "./models/appModel.js";
import User from "./models/userModel.js";
import Eadge from "./models/eadgeModel.js";
import { deleteFolderRecursive } from "./test.js";
import fs from "fs";
import path from "path";
let channelArray = [];
let nms;
let blockChannelArray = [];
const folderPath = path.join(new URL(".", import.meta.url).pathname, "media");

const findChannel = async () => {
  try {
    const channels = await Channel.find({isBlocked:false});
    const streamKeys = channels.map((data) => data.streamKey);
    channelArray = [...streamKeys];
  } catch (err) {
    console.error(err);
  }
};

export const blockedChannels = async () => {
  try {
    const channles = await Channel.find({ isBlocked: true });
    const streamKeys = channles.map((data) => data.streamKey.split("/")[1]);
    blockChannelArray = [...streamKeys];
    console.log(blockChannelArray);
  } catch (error) {
    confirm.log(error);
  }
};

async function loadConfig() {
  const tasks = await App.findOne({});
  if (!tasks) {
    return [
      {
        app: "live1",
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
        hlsKeep: true,
        dash: true,
        dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
        dashKeep: true,
        mp4: true,
        mp4Flags: "[movflags=frag_keyframe+empty_moov]",
      },
    ];
  }

  const transTasksArray = [];
  const number = tasks.number;
  const name = tasks.name;
  for (let i = 1; i <= number; i++) {
    if (!tasks.deletedNumber.includes(i)) {
      transTasksArray.push({
        app: name + i,
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
        hlsKeep: true, // to prevent hls file delete after end the stream
        dash: true,
        dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
        dashKeep: true, // to prevent dash file delete after end the stream
      });
    }
  }
  return transTasksArray;
}

async function loadPushConfig() {
  const edgeTasksArray = [];
  const edge = await Eadge.find();

  if (!edge || edge.length === 0) {
    return edgeTasksArray;
  }

  for (let i = 0; i < edge.length; i++) {
    edgeTasksArray.push({
      app: edge[i].name,
      mode: "push",
      edge: edge[i].edge,
      appendName: false,
      rtsp_transport: "tcp",
    });
  }

  return edgeTasksArray;
}

async function loadConfigStart() {
  const trans = await loadConfig();
  const edge = await loadPushConfig();
  return { trans, edge };
}

async function setupNMS(trans, edge) {
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
      tasks: trans,
    },
    relay: {
      ffmpeg: "/usr/bin/ffmpeg",
      tasks: edge,
    },
    auth: {
      api: true,
      api_user: "codenuity",
      api_pass: "codenuity",
    },
  });

  nms.run();

  nms.on("prePublish", async (id, StreamPath, args) => {
    const isValidStreamKey = channelArray.includes(StreamPath);
    if (!isValidStreamKey) {
      const session = nms.getSession(id);
      return session.reject();
    }

    const channel = await Channel.findOne({ streamKey: StreamPath });
    const user = await User.findById(channel.userId);

    if (!user.isActive) {
      const session = nms.getSession(id);
      return session.reject();
    }

    await Channel.findOneAndUpdate(
      { streamKey: StreamPath },
      { $set: { status: true, startTime: new Date(Date.now()) } },
      { new: true, multi: true }
    );

    await User.findOneAndUpdate(
      user._id,
      { $set: { status: true } },
      { new: true }
    );
  });

 
 
  nms.on("donePublish", async (id, StreamPath, args) => {
    const channel = await Channel.findOne({ streamKey: StreamPath });
    const user = await User.findById(channel.userId);

    await Channel.findOneAndUpdate(
      { streamKey: StreamPath },
      { $set: { status: false, startTime: null } },
      { new: true, multi: true }
    );

    await User.findOneAndUpdate(
      user._id,
      { $set: { status: false } },
      { new: true }
    );
  });

  nms.on("prePlay", (id, StreamPath, args) => {
    console.log(
      "[NodeEvent on prePlay]",
      `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
    );
    // let session = nms.getSession(id);
    // session.reject();
  });

  return nms;
}

async function startServer() {
  await findChannel();
  // deleteFolderRecursive(folderPath);
   setTimeout(async () => {
     const { trans, edge } = await loadConfigStart();
     nms = await setupNMS(trans, edge); 
   },1000)
}

export async function restartServer() {
  nms.stop();
  startServer();
}

export default startServer();
