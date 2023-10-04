const config = {
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
    tasks: [
      {
        app: "live",
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
        hlsKeep: true, 
        dash: true,
        dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
        dashKeep: true,
      },
      {
        app: "live",
        mp4: true,
        mp4Flags: "[movflags=frag_keyframe+empty_moov]",
      },
    ],
  },
  relay: {
    ffmpeg: "/usr/bin/ffmpeg",
    tasks: [
      {
        app: "live",
        mode: "pull",
        edge: "rtmp://192.168.29.169:1936",
      },
      {
        app: "live",
        mode: "push",
        edge: "rtmp://192.168.29.169/live/1234",
      },
    ],
  },
};

export default config;
