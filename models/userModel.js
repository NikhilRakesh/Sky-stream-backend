import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    domains:{
        type:Array
    },

    isActive:{
        type : Boolean ,
         default : true
    }
});


 const User=mongoose.model("userModel",userSchema);
 export default User

