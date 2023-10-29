import Channel from "../models/channelModel.js";
import Eadge from "../models/eadgeModel.js";
import User from "../models/userModel.js";
import { restartServer } from "../server.js";

export const pushStream = async (req, res) => {
  try {
    const { userId, channelId } = req.params;
    const { edge } = req.body;

    if (!userId || !channelId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById({ _id: userId });

    if (!user.superAdmin) {
      return res.status(401).json({ message: "You are not an Admin" });
    }

    const channel = await Channel.findById(channelId);

    const newName = channel.streamKey.split("/")[1];

    const newEdge = new Eadge({
      name: newName,
      edge: edge,
      channelId: channel._id,
    });

    await newEdge
      .save()
      .then(async (data) => {
        await restartServer();
        console.log(data)
      })
      .then((data) => res.status(200).json({ data: data }))
      .catch((err) =>{
        console.log(err.message)
      
        res.status(500).json({ message: "Internal Server error" })
       });
     
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

    const edge = await Eadge.deleteOne({ _id: channelId })
      .then((data) => console.log(data))
      .catch((err) => {
        console.log(err.message);
      });

      restartServer();

    res.status(204).json({ message: "No Content" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getPush = async (req, res) => {
  try {
    const { channelId } = req.params;

    console.log(channelId);

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
