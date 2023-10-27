//creating the channel
import App from "../models/appModel.js";
import Channel from "../models/channelModel.js";
import User from "../models/userModel.js";
import { findChannel } from "../server.js";





export const createChannel= async (req,res)=>{
   try {

     const {name,domain,streamKey}=req.body; 
     const {userId}=req.params;

     console.log('req.body',req.body)

     if(!name||!domain){
         return res.status(401).json({message:"Please provide all fields"})
     }
    
 
    let APP = await App.findOne({});

    if (!APP || APP.length <= 0) {
      const app = new App({
        name: "live",
        number: 1,
      });
      await app.save();
      APP = await App.findOne({});
    }

    let number = APP.number;

    let userApp = "live" + number;

     const key ='/'+userApp+'/'+streamKey;
     const newChannel=new Channel({
      userId,
        name:name,
        domain:domain,
        streamKey:key
     });
     
     newChannel.save().then((data)=>{
      const newNumber = number + 1;
      App.findOneAndUpdate(
        { _id: APP._id },
        { $set: { number: newNumber } },
        { new: true }
      ).then((data) => console.log(data));
       findChannel();
        return res.status(201).json(data)
     }).catch(err=>{
        return res.status(500).json({error:err.message})
     })
   } catch (error) {
    console.log(error.message)
    return res.status(500).json({message:"Internal Server Error"})
   }
}


export const getChannel=async (req,res)=>{
  try {
    
    const {userId}=req.params;

    if(!userId){
      return res.status(401).json({message:"user Auth failed"})
    }

    const user = await User.findById({_id:userId})

    
    if(user.superAdmin){
      
      const channel = await Channel.find({})

      return res.status(201).json({data:channel})

    }
    
    const channels=await Channel.find({userId:userId});

    console.log(channels);

    return res.status(201).json({data:channels})


  } catch (error) {
    
    return res.status(500).json({message:"Internal Server Error"})

  }
}