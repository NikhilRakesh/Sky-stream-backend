import User from "../models/userModel.js";
import CryptoJS from "crypto-js";
import { authenticator } from "otplib";
import { message, transporter, cb } from "../config/nodemailer.js";
import  jwt  from "jsonwebtoken";


let email;
let newOtp;

const generateOTP = () => {
  const secret = authenticator.generateSecret();
  const token = authenticator.generate(secret);
  return token;
};

const hashPassword = async(pass) => {
  return CryptoJS.AES.encrypt(pass, process.env.SECRET_KEY).toString();
};

const decryptPassword = async (pass) => {
  const bytes = CryptoJS.AES.decrypt(pass, process.env.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const userCreation = async (req, res, next) => {
  try {
    const { email, password, domain, color, limit } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    //maping the name and index
    const domainList = domain.map((name, index) => ({
      name,
      limit: limit[index],
    }));


    const encryptedPassword = await hashPassword(password);

    const newUser = new User({
      email,
      password: encryptedPassword,
      domains: domainList,
      color: color, //DONE Destrature body color -done
      isActive: true,
    })
    
    //TODO Decrypting the password for response -its testing

    const decryptedPassword = await decryptPassword(newUser.password);
    
    const token = jwt.sign(
      { _id: newUser._id },
       process.env.JWT_SECRET, 
        { expiresIn: '2h' })
        
        newUser.token = token
      newUser.save();
    // Save the user and respond with the decrypted password
    
    
    newUser.password = decryptedPassword;
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Bad Request: Email and password are required" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid credentials" });
    }

    // Decrypt the stored hashed password
    const decryptedStoredPassword = await decryptPassword(user.password);

    // DONE :Refactor the below  -done
    

    if (password === decryptedStoredPassword) {
      return res.status(200).json({ message: "Login successful", user }); //TODO usedate is not found in response  -Done
    }
    if (password !== decryptedStoredPassword) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in userLogin:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  email = req.body.email;
  const user = await User.findOne({ email: email });
  if (!email) {
    return res.status(404).json({ error: "Email is Requireded" });
  }
  if (!user) {
    return res.status(400).json({ error: "Email is not getting" });
  }

  try {
    const subject = "OTP From Stream Well";
    newOtp = generateOTP();
    transporter.sendMail(message(email, subject, newOtp), cb);
    res.status(200).json(email);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const verifyOtp = (req, res) => {
  const token = req.body.otp;
  try {
    if (!token) {
      return res.status(401).json({ error: "OTP is required !" });
    }
    if (token == newOtp) {
      return res.status(201).json({ message: "OTP verified successfully" });
    } else {
      return res.status(401).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const resetPass = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password) {
      return res.status(403).json({ error: "Password field can't be empty" });
    }
    // [x] DESTRUCTURE  -done
    if (password === confirmPassword) {
      const resetEmail = email;
      const encryptedPassword =  hashPassword(password);
      await User.findOneAndUpdate(
        { email: resetEmail },
        { $set: { password: encryptedPassword } },
        { new: true }
      );

      return res.status(201).json({ message: "Successfully reset" });
    } 
    if(password!==confirmPassword) {
      return res.status(406).json({ error: "Confirm Password doesnot match" });
    }
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
};
