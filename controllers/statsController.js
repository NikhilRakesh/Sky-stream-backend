import fetch from "node-fetch";
import User from "../models/userModel.js";


export const getSystemStats = async (req, res) => {
  try {
    let data   
      const response = await fetch("http://localhost:8000/api/server");
      data = await response.json();
      const memoryUsage = process.memoryUsage();
      const totalMemoryUsage =
     Math.floor( (memoryUsage.rss + memoryUsage.heapUsed) / (1024 * 1024))  
   

      let serverStats = {
        inBandwidth: data.net.inbytes,
        outBandwidth: data.net.outbytes, 
        cpuLoad: data.cpu.load,
        totalMemoryUsage

      };

    res.status(200).json({serverStats});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getStreamStats = async (req, res) => {
  try {
    let data;
      const response = await fetch("http://localhost:8000/api/streams");
      data = await response.json();

      
      
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLiveNow = async (req, res) => {
    try {
      let data;
      let liveNowKeys 
      const userLiveNow =[]

      const response = await fetch("http://localhost:8000/api/streams");
      data = await response.json();
      liveNowKeys = Object.keys(data);
      let liveNowChannelsKeys



      for (const key of liveNowKeys) {

        const user = await User.findOne({ app: key}).then((data)=>{
            data.password=null;
            const newUserData = {
             name:data.name,
             _id:data._id,

            };
            userLiveNow.push(newUserData)
        }).catch((err)=>{
            console.log(err)
        })
      }
      

    res.status(200).json({ data: userLiveNow });
 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}