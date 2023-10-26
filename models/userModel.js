import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    domains: {
      type: Array,
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
      type: String,
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
    },
    app: {
      type: String,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("userModel", userSchema);
export default User;
