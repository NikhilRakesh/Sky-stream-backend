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
    superAdmin:{
        type :Boolean ,
        default : false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    color:{
        type: String,
        default:"#03a9f4"
    },
    token:{
        type:String,
        default:null,
      },
      resetPass:{
        type:Number,
        default:0
      },
      addUser:{
        type:Boolean,
        default:false
      },
      deleteUser:{
        type:Boolean,
        default:false
      },
      chanelLimit:{
        type:Boolean,
        default:false
      },
      createChanel:{
        type:Boolean,
        default:false
      },
      deleteChanel:{
        type:Boolean,
        default:false
      }




},{timestamps:true});


 const User=mongoose.model("userModel",userSchema);
 export default User

