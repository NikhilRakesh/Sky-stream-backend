import User from "../models/userModel.js"

export const users=async(req,res)=>{
  try {
      const user=await User.find({isAdmin:false});
      console.log(user.data);
      res.status(201).json(user);
  } catch (error) {
        res.status(500).json(error.message)
    
  }

}