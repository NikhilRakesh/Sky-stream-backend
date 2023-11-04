import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      default: null,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    superAdmin: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#03a9f4",
    },
    token: {
      type: String,
      default: null,
    },
    resetPass: {
      type: Number,
      default: 0,
    },
    addedBy: {
      type: mongoose.Schema.ObjectId,
    },
    addUser: {
      type: Boolean,
      default: false,
    },
    deleteUser: {
      type: Boolean,
      default: false,
    },
    channelLimit: {
      type: Number,
      default: 0,
    },
    createChannel: {
      type: Boolean,
      default: false,
    },
    deleteChannel: {
      type: Boolean,
      default: false,
    },
    message: {
      block: {
        type: Boolean,
        default: false,
      },
      data: {
        type: String,
        default: null,
      },
      subject:{
        type:String,
        default:null
      }
    },
    app: {
      type: String,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    pushLive:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

const User = mongoose.model("userModel", userSchema);
export default User;
