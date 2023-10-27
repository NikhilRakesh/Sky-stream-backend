import fetch from "node-fetch";
import User from "../models/userModel.js";
import Channel from "../models/channelModel.js";

export const getSystemStats = async (req, res) => {
  try {
    let data;
    const response = await fetch("http://localhost:8000/api/server");
    data = await response.json();
    const memoryUsage = process.memoryUsage();
    const totalMemoryUsage = Math.floor(
      (memoryUsage.rss + memoryUsage.heapUsed) / (1024 * 1024)
    );

    let serverStats = {
      inBandwidth: data.net.inbytes,
      outBandwidth: data.net.outbytes,
      cpuLoad: data.cpu.load,
      totalMemoryUsage,
    };

    res.status(200).json({ serverStats });
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
    const { userId } = req.params;
    console.log(userId);
    let data;
    let liveNowKeys;

    const user = await User.findById({ _id: userId });

    const response = await fetch("http://localhost:8000/api/streams");
    data = await response.json();
    liveNowKeys = Object.keys(data);

    if (user.superAdmin) {
      const liveNowChannel = await Channel.find({ status: true });
      res.status(200).json({ data: liveNowChannel });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 