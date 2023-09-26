import NodeMediaServer from "node-media-server";
import nmsConfig from "./config/mediaServer.js";
import Channel from "./models/channelModel.js";

let channelArray = [];
 export const findChannel = (async()=>{
  try{
   const channel = await Channel.find();
      channelArray = channel.map((data)=>{return data.streamKey})
  }catch(err)
  {
     console.log(err);
  }
})()

const nms = new NodeMediaServer(nmsConfig)

nms.run();

 
nms.on('prePublish', async (id, StreamPath, args) => {
  const isValidStreamKey = channelArray.includes(StreamPath)
  
  if (!isValidStreamKey) {
    const session = nms.getSession(id);
    session.reject();
  }
});
