onPostPublish(id, streamPath, args) {
    if (!this.config.relay.tasks) {
    return;
    }
    console.log("AKI", streamPath);
    let regRes = /\/(.*)\/(.*)/gi.exec(streamPath);
    let [app, stream] = _.slice(regRes, 1);
    console.log(stream);
    let i = this.config.relay.tasks.length;
    while (i--) {
      let conf = this.config.relay.tasks[i];
      let isPush = conf.mode === 'push';
      if (isPush && app === conf.app) {
      let hasApp = conf.edge.match(/rtmp:\/\/([^\/]+)\/([^\/]+)/);
      conf.ffmpeg = this.config.relay.ffmpeg;
      conf.inPath = `rtmp://127.0.0.1:${this.config.rtmp.port}${streamPath}`;
      conf.ouPath = hasApp ? `${conf.edge}` : `${conf.edge}`;
      let session = new NodeRelaySession(conf);
      session.id = id;
      session.on('end', (id) => {
        this.dynamicSessions.delete(id);
      });
      this.dynamicSessions.set(id, session);
      session.run();
      Logger.log('[Relay dynamic push] start', id, conf.inPath, ' to ', conf.ouPath);
      }
    }

  }