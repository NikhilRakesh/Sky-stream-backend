//creating the channel
import Channel from "../models/channelModel.js";
import User from "../models/userModel.js";



export const createChannel= async (req,res)=>{
   try {
      // Get userId from Global state
     const {name,domain,userId}=req.body; 
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
     const key = parts[0]+"@"+name
     const newChannel=new Channel({
        name:name,
        domain:domain,
        streamKey:key
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

