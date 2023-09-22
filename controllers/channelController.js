//creating the channel
import Channel from "../models/channelModel.js";


export const createChannel=(req,res)=>{
   try {
     const {name,domain}=req.body;
     if(!name||!domain){
         return res.status(401).json({message:"Please provide all fields"})
     }
     const newChannel=new Channel({
        name:name,
        domain:domain
     });
     newChannel.save().then((data)=>{
        
        return res.status(201).json(data)
     }).catch(err=>{
        return res.status(500).json({error:err.message})
     })
   } catch (error) {
    return res.status(500).json({message:"Internal Server Error"})
   }
}

