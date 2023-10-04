import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  
  name: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true
  },
  streamKey:{
    type:String,
    required:true,
    unique:true
  }
  
},
{
  timestamps:true
});

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;
