import User from "../models/userModel.js";
import CryptoJS from "crypto-js";
import {authenticator} from "otplib";
import { message, transporter,cb } from '../config/nodemailer.js';

let email;
let newOtp;

const generateOTP=()=>{
  const secret=authenticator.generateSecret();
  const token=authenticator.generate(secret);
  console.log(token);
  return token
}



const hashPassword = async (pass) => {
  return await CryptoJS.AES.encrypt(pass, process.env.SECRET_KEY).toString();
}

const decryptPassword = async (pass) => {
  const bytes = CryptoJS.AES.decrypt(pass, process.env.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export const userCreation = async (req, res, next) => {
  try {
    const { email, password, domain, limit } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const domainList = domain.map((name, index) => ({
      name,
      limit: limit[index]
    }));

    const encryptedPassword = await hashPassword(password);

    const newUser = new User({
      email,
      password: encryptedPassword,
      domains: domainList,
      color:req.body.color, 
      isActive: true,
    });

    // Decrypting the password for response
    const decryptedPassword = await decryptPassword(newUser.password);

    // Save the user and respond with the decrypted password
    const savedUser = await newUser.save();
    savedUser.password = decryptedPassword;
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error while saving user:", error.message);
    res.status(500).json({ error: "Error while saving user" });
  }
};


export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Bad Request: Email and password are required" });
    }

    const user = await User.findOne({ email: email});

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid credentials" });
    }

    // Decrypt the stored hashed password
    const decryptedStoredPassword = await decryptPassword(user.password);

    if (password === decryptedStoredPassword) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Unauthorized: Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in userLogin:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




export const verifyEmail=async (req,res)=>{
  email=req.body.email;
  const user=await User.findOne({email:email})
  if(!email){
    return res.status(404).json({error:"Email is Requireded"});
  }
  if(!user){
    return res.status(400).json({error:"Email is not getting"})
  }

 try {
   
   const subject = "OTP From Stream Well";
    newOtp=generateOTP()
   transporter.sendMail(message(email,subject,newOtp),cb);
   res.status(201).json(email);
   
 } catch (error) {
    res.status(500).send(error.message)
 }

}

export const verifyOtp=(req,res)=>{
  const token=req.body.otp;
  try {
    if(!token){
      return res.status(401).json({error:"OTP is required !"});
    }
    if(token==newOtp){
      return res.status(201).json({message:"OTP verified successfully"});
    }else{
      return res.status(401).json({error:"Invalid OTP"});
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

export const resetPass=(req,res)=>{
  try {
    const {password}=req.body;
    

  } catch (error) {
    return res.status(500).json(error.message);
  }
}