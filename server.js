import NodeMediaServer from "node-media-server";
import Channel from "./models/channelModel.js";
import App from "./models/appModel.js";
import User from "./models/userModel.js";
import Eadge from "./models/eadgeModel.js";
import { streamKeys } from "./index.js";


  const nms = new NodeMediaServer({
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 180,
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
      tasks: [
        {
          app: "live",
          hls: true,
          hlsFlags: "[hls_time=4:hls_list_size=10:hls_flags=delete_segments]",
          hlsKeep: true, // to prevent hls file delete after end the stream
          dash: true,
          dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
          dashKeep: true,
          mp4: true,
          mp4Flags: "[movflags=frag_keyframe+empty_moov]",
          vc: "libx264",
          vcParam: [
            "-g",
            "30",
            "-vf",
            "scale=1280:-2",
            "-b:v",
            "2800k",
            "-preset",
            "fast",
            "-profile:v",
            "baseline",
            "-bufsize",
            "4200k",
          ],
        },
        {
          app: "live6",
          hls: true,
          hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
          hlsKeep: true, // to prevent hls file delete after end the stream
          dash: true,
          dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
          dashKeep: true,
          mp4: true,
          mp4Flags: "[movflags=frag_keyframe+empty_moov]",
          vc: "libx264",
          vcParam: [
            "-g",
            "30",
            "-vf",
            "scale=1280:-2",
            "-b:v",
            "2800k",
            "-preset",
            "fast",
            "-profile:v",
            "baseline",
            "-bufsize",
            "4200k",
          ],
        },
        {
          app: "live4",
          hls: true,
          hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
          hlsKeep: true, // to prevent hls file delete after end the stream
          dash: true,
          dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
          dashKeep: true,
          mp4: true,
          mp4Flags: "[movflags=frag_keyframe+empty_moov]",
          vc: "libx264",
          vcParam: [
            "-g",
            "30",
            "-vf",
            "scale=1280:-2",
            "-b:v",
            "2800k",
            "-preset",
            "fast",
            "-profile:v",
            "baseline",
            "-bufsize",
            "4200k",
          ],
        },
        {
          app: "live8",
          hls: true,
          hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
          hlsKeep: true, // to prevent hls file delete after end the stream
          dash: true,
          dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
          dashKeep: true,
          mp4: true,
          mp4Flags: "[movflags=frag_keyframe+empty_moov]",
          vc: "libx264",
          vcParam: [
            "-g",
            "30",
            "-vf",
            "scale=1280:-2",
            "-b:v",
            "2800k",
            "-preset",
            "fast",
            "-profile:v",
            "baseline",
            "-bufsize",
            "4200k",
          ],
        },
      ],
    },
    relay: {
      ffmpeg: "/usr/bin/ffmpeg",
      tasks: [],
    },
    auth: {
      api: true,
      api_user: "codenuity",
      api_pass: "codenuity",
    },
    fission: {
      ffmpeg: "/usr/bin/ffmpeg",
      tasks: [
        {
          rule: "live/*",
          model: [
            {
              ab: "128k",
              vb: "1500k",
              vs: "720x1280",
              vf: "30",
            },
            {
              ab: "64k",
              vb: "1000k",
              vs: "480x854",
              vf: "24",
            },
            {
              ab: "32k",
              vb: "600k",
              vs: "360x640",
              vf: "20",
            },
          ],
        },
      ],
    },
  });

  
  nms.on("prePublish", async (id, StreamPath, args) => {

      const isValidStreamKey = streamKeys.includes(StreamPath);
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
      { $set: { status: true, startTime: new Date(Date.now()) ,sessionId:id} },
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

 
  export default nms;
