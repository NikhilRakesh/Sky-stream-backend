if (!config.relay.tasks) {
  return;
}
console.log("AKI", StreamPath);
let regRes = /\/(.*)\/(.*)/gi.exec(StreamPath);
let [app, stream] = lodash.slice(regRes, 1);
console.log(stream);
let i = config.relay.tasks.length;
while (i--) {
  let conf = config.relay.tasks[i];
  let isPush = conf.mode === "push";
  if (isPush && app === conf.app) {
    let hasApp = conf.edge.match(/rtmp:\/\/([^\/]+)\/([^\/]+)/);
    conf.ffmpeg = config.relay.ffmpeg;
    conf.inPath = `rtmp://192.168.28.169:${config.rtmp.port}${StreamPath}`;
    console.log("conf.inPath", conf.inPath);
    conf.ouPath = hasApp ? `${conf.edge}` : `${conf.edge}`;
    let session = new NodeMediaServer(conf);
    console.log(
      "------------------------------out---------------------------------"
    );
    console.log("conf.inPath", conf.ouPath);
    session.id = id;
    session.on("end", (id) => {
      //  dynamicSessions.delete(id);
      console.log("end");
    });
    //  dynamicSessions.set(id, session);
    session.run();
    console.log(
      "[Relay dynamic push] start",
      id,
      conf.inPath,
      " to ",
      conf.ouPath
    );
  }
}
