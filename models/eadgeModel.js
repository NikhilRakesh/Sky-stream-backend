import mongoose from "mongoose"

const eadgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  edge: {
    type: String,
    required: true,
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  pushID:{
    type: String,
    required: true,
  }
});


const Eadge = mongoose.model("Eadge",eadgeSchema)

export default Eadge