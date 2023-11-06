import fetch from "node-fetch";
import Channel from "./models/channelModel.js";
const username = "codenuity";
const password = "codenuity";
const authString = `${username}:${password}`;
const base64Credentials = Buffer.from(authString).toString("base64");

export const getSingleLiveNow = async (req, res) => {
  try {

    const user = "654662702b8796e7a204fa5a";

    const channel = await Channel.findOne({ userId: user });

    console.log(channel)

     const headers = {
       Authorization: `Basic ${base64Credentials}`,
     };
    
    const response = await fetch("http://localhost:8000/api/streams", {
      method: "GET",
      headers,
    });

    if (!response.ok) {
        res.send(400).json({message:"No data found"})
    }

    const data = await response.json();

    console.log(data);
    // const live = data[appName];

    // if (!live) {
    //     return res.status(400).json({message:"No data found"})
    // }

    // const publisherData = live[streamKey].publisher;
    // const inBytes = publisherData.bytes;
    // const subscribers = live[streamKey].subscribers;
    // const outBytes = subscribers.reduce((total, sub) => total + sub.bytes, 0);

    // const inMbps = (inBytes * 8) / 1000000
    // const outMbps = (outBytes * 8) / 1000000;

    // res.status(200).json({data:{inMbps,outMbps}});



  } catch (error) {
   console.log(error.message)
  }
};


getSingleLiveNow()