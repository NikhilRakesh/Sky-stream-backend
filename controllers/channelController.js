//creating the channel
import Channel from "../models/channelModel.js";
import User from "../models/userModel.js";
import { findChannel } from "../server.js";





export const createChannel= async (req,res)=>{
   try {
      // Get userId from Global state
     const {name,domain}=req.body; 
     const {userId}=req.params;
    
     const exist = await Channel.findOne({name:name})

     if(!name||!domain){
         return res.status(401).json({message:"Please provide all fields"})
     }

   if(exist)
   {
      return res.status(401).json({message:"Channel already exits!"})
   }

     const user = await User.findById({_id:userId})
     if(!user)
     {
          return res.status(500).json({message:"User Data Not Found"})
     }
     
     const parts = user.email.split('@')
     const key ="/live/"+parts[0]+"@"+name
     const newChannel=new Channel({
      userId,
        name:name,
        domain:domain,
        streamKey:key
     });
     newChannel.save().then((data)=>{
       findChannel();
        return res.status(201).json(data)
     }).catch(err=>{
        return res.status(500).json({error:err.message})
     })
   } catch (error) {
    return res.status(500).json({message:"Internal Server Error"})
   }
}


