import fetch from "node-fetch";
import User from "../models/userModel.js";
import Channel from "../models/channelModel.js";
const username = "codenuity";
const password = "codenuity";
const authString = `${username}:${password}`;
const base64Credentials = Buffer.from(authString).toString("base64"); // Use Buffer to encode in base64

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

    let inband = 0;
    let outband = 0;

    console.log('inbuytes',data.net.inbytes);

     inband = Math.floor(data.net.inbytes / (1024 * 1024) ) || 0;

     outband = Math.floor(data.net.outbytes / (1024 * 1024))  || 0;

    const serverStats = {
      inBandwidth: inband,
      outBandwidth: outband,
      cpuLoad: data.cpu.load,
      totalMemoryUsage,
    };

    console.log(serverStats);

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
      const response = await fetch("http://localhost:8000/api/streams", {
        method: "GET",
        headers,
      });
      const data = await response.json();
      liveNowChannel = Object.values(data).filter(
        (channel) => channel.userId === user._id && channel.status
      );
    }

    res.status(200).json({ data: liveNowChannel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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
    const inBytes = publisherData.bytes;
    const subscribers = live[key].subscribers;
    const outBytes = subscribers.reduce((total, sub) => total + sub.bytes, 0);

    const inMbps = (inBytes * 8) / 1000000;
    const outMbps = (outBytes * 8) / 1000000;

    res.status(200).json({ data: { inMbps, outMbps } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
