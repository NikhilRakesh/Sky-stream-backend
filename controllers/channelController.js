//creating the channel
import App from "../models/appModel.js";
import Channel from "../models/channelModel.js";
import User from "../models/userModel.js";
import { restartServer } from "../server.js";

export const createChannel = async (req, res) => {
  try {
    const { name, domain, streamKey } = req.body;
    const { userId } = req.params;
  
    if (!userId) {
      return res.status(401).json({ message: "User authentication failed" });
    }
  
    const isAdmin = await User.findById(userId);
  
    if (!isAdmin || !isAdmin.createChannel) {
      return res.status(401).json({ message: "Not authorized" });
    }
  
    if (!name || !domain) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    let APP = await App.findOne({});
  
    let number;
    let deleted = false;
  
    if (!APP || APP.deletedNumber.length === 0) {
      const app = new App({
        name: "live",
        number: 1,
      });
      await app.save();
      APP = await App.findOne({});
      number = APP.number;
    } else {
      deleted = true;
      number = APP.deletedNumber[0];
      const newDeletedArray = APP.deletedNumber.slice(1);
      await App.findOneAndUpdate(
        { _id: APP._id },
        { deletedNumber: newDeletedArray },
        { new: true }
      );
    }

    const userApp = "live" + number;
    const key = "/" + userApp + "/" + streamKey;
 
     const newChannel = new Channel({
      userId,
      name,
      domain,
      streamKey: key,
      number,
    });

    await newChannel.save().then((data) => {
      if (!deleted) {
        const newNumber = number + 1;
        return App.findOneAndUpdate(
          { _id: APP._id },
          { $set: { number: newNumber } },
          { new: true }
        );
      }
      return Promise.resolve(data);
    });

    restartServer();
    return res.status(201).json(newChannel);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getChannel = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "user Auth failed" });
    }

    const user = await User.findById({ _id: userId });

    if (user.superAdmin) {
      const channel = await Channel.find({});

      return res.status(201).json({ data: channel });
    }

    const channels = await Channel.find({ userId: userId });

    console.log(channels);

    return res.status(201).json({ data: channels });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!channelId) {
      return res.status(401).json({ message: "Channel Id not found" });
    }

    const channelNumber = await Channel.findById({ _id: channelId });

    const updateDeleteNumber = await App.findOneAndUpdate(
      {},
      { $push: { deletedNumber: channelNumber.number } },
      { new: true }
    )
      .then((data) => console.log(data))
      .catch((err) => console.log(err.message));

    const channel = await Channel.findByIdAndDelete({ _id: channelId });

    return res.status(204).json({ message: "Channel deleted" });

    restartServer();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
