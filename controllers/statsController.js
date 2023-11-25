import fetch from "node-fetch";
import User from "../models/userModel.js";
import Channel from "../models/channelModel.js";
const username = "codenuity";
const password = "codenuity";
const authString = `${username}:${password}`;
const base64Credentials = Buffer.from(authString).toString("base64"); 
 let lastInBytes= 0 ;
let lastOtBytes= 0 ;
    let inband = 0;
    let outband = 0;

export const getSystemStats = async (req, res) => {
  try {
   
    const headers = {
      Authorization: `Basic ${base64Credentials}`,
    };

    const response = await fetch("http://localhost:8000/api/server", {
      method: "GET",
      headers,
    });

    const data = await response.json();
    const memoryUsage = process.memoryUsage();
    const totalMemoryUsage = Math.floor(
      (memoryUsage.rss + memoryUsage.heapUsed) / (1024 * 1024)
    );

    inband =  parseFloat(
     ((data.net.inbytes - lastInBytes) / (1024 * 1024)).toFixed(2)
   );
    outband = parseFloat(
     ((data.net.outbytes - lastOtBytes) / (1024 * 1024)).toFixed(2)
   );

      
     const serverStats = { 
       inBandwidth: inband || 0,
       outBandwidth: outband || 0,
       cpuLoad: data.cpu.load,
       totalMemoryUsage,
      };

      lastInBytes = data.net.inbytes
      lastOtBytes = data.net.outbytes 
    res.status(200).json({ data: serverStats });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getStreamStats = async (req, res) => {
  try {
    let data;
    const headers = {
      Authorization: `Basic ${base64Credentials}`,
    };
    const response = await fetch("http://localhost:8000/api/streams", {
      method: "GET",
      headers,
    });
    data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLiveNow = async (req, res) => {
  try {
    const { userId } = req.params;

    const headers = {
      Authorization: `Basic ${base64Credentials}`,
    };

    const user = await User.findById(userId);

    let liveNowChannel;

    if (user.superAdmin) {
      liveNowChannel = await Channel.find({ status: true });
    } else {
      console.log('user',user)
      const response = await fetch("http://localhost:8000/api/streams", {
        method: "GET",
        headers,
      });
      const data = await response.json();
      liveNowChannel = await Channel.find({ userId: userId, status: true });

      console.log('liveNowChannel',Object.values(data))
    }

    res.status(200).json({ data: liveNowChannel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

let singleInBytes = 0;
let singleOutBytes = 0;
let lastSingleInBytes = 0;
let lastSingleOutBytes = 0;

export const getSingleLiveNow = async (req, res) => {
  try {
    const { app, key } = req.params;
    // const [app, key] = app.split("/").slice(1, 3);

    const headers = {
      Authorization: `Basic ${base64Credentials}`,
    };

    const response = await fetch("http://localhost:8000/api/streams", {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      res.status(400).json({ message: "No data found" });
    }

    const data = await response.json();
    const live = data[app];

    if (!live) {
      return res.status(400).json({ message: "No data found" });
    }

    const publisherData = live[key].publisher;
    singleInBytes = publisherData.bytes;
    const subscribers = live[key].subscribers;
     singleOutBytes = subscribers.reduce((total, sub) => total + sub.bytes, 0);

    const inMbps =  parseFloat(((singleInBytes - lastSingleInBytes) / (1024 * 1024)).toFixed(2));

    const outMbps =  parseFloat(((singleOutBytes - lastSingleOutBytes) / (1024 * 1024)).toFixed(2));



    lastSingleInBytes = publisherData.bytes;
    lastSingleOutBytes = singleOutBytes;


    res.status(200).json({ data: { inMbps, outMbps } });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
