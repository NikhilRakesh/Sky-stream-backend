import fetch from "node-fetch";
import User from "../models/userModel.js";
import Channel from "../models/channelModel.js";
const username = "codenuity";
const password = "codenuity";
const authString = `${username}:${password}`;
const base64Credentials = Buffer.from(authString).toString("base64");
let lastInBytes = 0;
let lastOtBytes = 0;
let inband = 0;
let outband = 0;
import os from 'os';
import path from 'path';
import fs from 'fs';
// import diskstats from 'diskstats';
import diskinfo from 'node-disk-info';
import si from 'systeminformation';
let prevDiskInfo = null; 

export const getSystemStats = async (req, res) => {
  try {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const cpuCount = os.cpus().length;
    const loadAvg = os.loadavg();

    const memoryUsage = Math.round(((totalMemory - freeMemory) / totalMemory) * 100);
    const cpuUsage = Math.round((loadAvg[0] / cpuCount) * 100);

    const diskInfo = await si.fsSize();

    let diskRead = 0;
    let diskWrite = 0;

    // Calculate disk read and write rates if previous disk info is available
    if (prevDiskInfo) {
      // Loop through each disk
      for (const currentDisk of diskInfo) {
        // Find the corresponding disk in the previous disk info
        const prevDisk = prevDiskInfo.find(prev => prev.fs === currentDisk.fs);
        if (prevDisk) {
          // Calculate read and write rates for the current disk
          const readRate = (currentDisk.used - prevDisk.used) / 5; // Assuming a 5-second interval
          const writeRate = (currentDisk.size - prevDisk.size) / 5; // Assuming a 5-second interval

          diskRead += readRate;
          diskWrite += writeRate;
        }
      }
    }

    // Store current disk info for the next iteration
    prevDiskInfo = diskInfo;

    const inBandwidth = 100;
    const outBandwidth = 50;

    const serverStats = {
      totalMemory,
      freeMemory,
      memoryUsage,
      cpuCount,
      cpuUsage,
      inBandwidth,
      outBandwidth,
      diskRead,
      diskWrite,
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
    const response = await fetch("http://localhost:3000/api/streams", {
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

      const response = await fetch("http://localhost:3000/api/streams", {
        method: "GET",
        headers,
      });
      
      // const data = await response.json();
      liveNowChannel = await Channel.find({ userId: userId, status: true });

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

    const response = await fetch("http://localhost:3000/api/streams", {
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

    const inMbps = parseFloat(((singleInBytes - lastSingleInBytes) / (1024 * 1024)).toFixed(2));

    const outMbps = parseFloat(((singleOutBytes - lastSingleOutBytes) / (1024 * 1024)).toFixed(2));



    lastSingleInBytes = publisherData.bytes;
    lastSingleOutBytes = singleOutBytes;


    res.status(200).json({ data: { inMbps, outMbps } });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
