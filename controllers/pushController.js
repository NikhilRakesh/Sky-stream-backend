import fetch from "node-fetch";
import Channel from "../models/channelModel.js";
import Eadge from "../models/eadgeModel.js";
import User from "../models/userModel.js";
// import { restartServer } from "../server.js";
const username = "codenuity";
const password = "codenuity";
const authString = `${username}:${password}`;
const base64Credentials = Buffer.from(authString).toString("base64");

export const pushStream = async (req, res) => {
  try {
    const { userId, channelId } = req.params;
    const { edge } = req.body;

    if (!userId || !channelId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById({ _id: userId });

    if (!user.superAdmin && !user.pushLive) {
      return res.status(401).json({ message: "You are not an Admin" });
    }

    const channel = await Channel.findById(channelId);

    const newApp = channel.streamKey.split("/")[1];
    const newName = channel.streamKey.split("/")[2];

    const headers = await {
      Authorization: `Basic ${base64Credentials}`,
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      name: newName,
      app: newApp,
      url: edge,
    });

    const response = await fetch("http://127.0.0.1:8000/api/relay/push", {
      method: "POST",
      headers,
      body,
    });



    if (response.status === 200) {
      const responseData = await response.text();

      const newEdge = new Eadge({
        name: newName,
        edge: edge,
        channelId: channel._id,
        pushID: responseData,
      });

      await newEdge
        .save()
        .then((data) => res.status(200).json({ data: data }))
        .catch((err) => {
          res.status(500).json({ message: "Internal Server error" });
        });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const deletePush = async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!channelId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const headers = await {
      Authorization: `Basic ${base64Credentials}`,
      "Content-Type": "application/json",
    };

    const edge = await Eadge.findOne({ _id: channelId });

    const response = await fetch(
      `http://127.0.0.1:8000/api/relay/${edge.pushID}`,
      {
        method: "DELETE",
        headers,
      }
    );

    // if (!response.ok) {
    //   return res.status(401).json({ message: "Not authorized" });
    // }

    const deletedEdge = await Eadge.deleteOne({ _id: channelId }).catch((err) => {
      console.log(err.message);
    });

    res.status(204).json({ message: "No Content" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
    console.log(error.message);
  }
};

export const getPush = async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!channelId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const edge = await Eadge.find({ channelId: channelId }).catch((err) => {
      console.log(err.message);
      return res.status(204);
    });

    return res.status(200).json({ data: edge });
  } catch (error) {}
};
