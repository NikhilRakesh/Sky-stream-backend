import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  }
});

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;
