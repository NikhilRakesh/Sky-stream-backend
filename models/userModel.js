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
    },
    isAdmin:{
        type :Boolean  ,
        default : false
    },
    color:{
        type: String,
        default:"#03a9f4"
    }
});


 const User=mongoose.model("userModel",userSchema);
 export default User

