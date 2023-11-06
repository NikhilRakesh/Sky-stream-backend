import fetch from "node-fetch";
import User from "../models/userModel.js";
import Channel from "../models/channelModel.js";

const username = "codenuity";
const password = "codenuity";
const authString = `${username}:${password}`;
const base64Credentials = Buffer.from(authString).toString("base64"); // Use Buffer to encode in base64

export const getSystemStats = async (req, res) => {
  try {
    let data;
    const headers = {
      Authorization: `Basic ${base64Credentials}`,
    };

    const response = await fetch("http://localhost:8000/api/server", {
      method: "GET",
      headers,
    });
    data = await response.json();
    const memoryUsage = process.memoryUsage();
    const totalMemoryUsage = Math.floor(
      (memoryUsage.rss + memoryUsage.heapUsed) / (1024 * 1024)
    );

    let serverStats = {
      inBandwidth: Math.floor(data.net.inbytes / 125000) || 0,
      outBandwidth: Math.floor(data.net.outbytes / 125000) || 0,
      cpuLoad: data.cpu.load,
      totalMemoryUsage,
    };

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
    console.log(userId);
    let data;
    let liveNowKeys;
    const headers = {
      Authorization: `Basic ${base64Credentials}`,
    };

    const user = await User.findById({ _id: userId });

    const response = await fetch("http://localhost:8000/api/streams", {
      method: "GET",
      headers,
    });
    data = await response.json();
    liveNowKeys = Object.keys(data);

    if (user.superAdmin) {
      const liveNowChannel = await Channel.find({ status: true });
      res.status(200).json({ data: liveNowChannel });
    }

    const liveNowChannel = await Channel.find({
      userId: user._id,
      status: true,
    });

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
