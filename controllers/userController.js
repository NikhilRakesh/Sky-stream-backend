import User from "../models/userModel.js";
import CryptoJS from "crypto-js";
import { authenticator } from "otplib";
import { message, transporter, cb } from "../config/nodemailer.js";
import jwt from "jsonwebtoken";
import appSchema from "../models/appModel.js";


let email;
let newOtp; 
const generateOTP = () => {
  const secret = authenticator.generateSecret();
  const token = authenticator.generate(secret);
  return token;
};


const hashPassword = async (pass) => {
  return CryptoJS.AES.encrypt(pass, process.env.SECRET_KEY).toString();
};


const decryptPassword = async (pass) => {
  const bytes = CryptoJS.AES.decrypt(pass, process.env.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const userCreation = async (req, res, next) => {
  try {
  
    const {
      name,
      email,
      password,
      domain,
      color,
      limit,
      addUser,
      deleteChannel,
      createChannel,
      deleteUser,
      expiryDate,
      channelLimit,
    } = req.body;
    const { id } = req.params;
    console.log(id);

    if (!id) {
      return res.status(400).json({ message: "Authorized user not found" });
    }

    //email & password want to required
    if (
      !name ||
      !email ||
      !password ||
      !domain ||
      !limit ||
      !addUser ||
      !deleteUser ||
      !createChannel ||
      !deleteChannel ||
      !expiryDate
    ) {
      return res.status(400).json({ message: "Required all the feilds" });
    }

    //checking the email id is existing or not
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(409).send({ error: "User already exists" });
    }

    //maping the name and index
    let domainList;
    if (typeof domain !== "string") {
      domainList = domain.map((name, index) => ({
        name,
        limit: limit[index],
      }));
    } else {
      domainList = {
        name: domain,
        limit,
      };
    }

    const encryptedPassword = await hashPassword(password);

    let isAdmin;
    if (id) {
      const userData = await User.findById({ _id: id });

      if (userData.superAdmin == true) {
        isAdmin = true;
      } else {
        isAdmin = false;
      }
    }

    let APP = await appSchema.findOne({});

    if (!APP || APP.length <= 0) {
      const app = new appSchema({
        name: "live",
        number: 1,
      });
      await app.save();
      APP = await appSchema.findOne({});
    }

    let number = APP.number;

    let userApp = "live" + number;

    //assigning the data into obj for saving the mongodb
    const newUser = new User({
      name,
      email,
      password: encryptedPassword,
      domains: domainList,
      color: color, 
      isActive: true,
      addedBy: id, //this is the param that get the logged user
      isAdmin,
      addUser,
      deleteUser,
      createChannel,
      deleteChannel,
      expiryDate,
      channelLimit,
      app: userApp,
    });


    const decryptedPassword = await decryptPassword(newUser.password);

    //saving the the objected data into mongodb
    newUser.save().then(() => {
      domainList = {};
      const newNumber = number + 1;
      appSchema
        .findOneAndUpdate(
          { _id: APP._id },
          { $set: { number: newNumber } },
          { new: true }
        )
        .then((data) => console.log(data));
    });

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




    if (password !== user.password) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid credentials" });
    }

    
    if (password === user.password) {
      return res.status(200).json({ message: "Login successful", data:user });
    }
   
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

}


//THIS IS FOR RESETING THE PASSWORD
//FIRST WE WANT TO GET THE EMAIL WHICH IS TO RESET THE PASSWORD
export const verifyEmail = async (req, res) => {
  try {
    email = req.body.email; //GETTNG THE EMAIL FROM THE REQ.BODY
    //IF THERE NO EMAIL IN THE REQ.BODY THEN IT WILL RETURN THE ERROR MESSAGE
    if (!email) {
      return res.status(404).json({ error: "Email is Requireded" });
    }
    const user = await User.findOne({ email: email }); //GETTING THE USER FROM THE MONGODB WITH THE EMAIL
    //IF HERE THE USER IS ENTER THE WRONG EMAIL OR NOT IN THE DB THEN SHOW THE ERROR
    if (!user) {
      return res.status(400).json({ error: "Email is not getting" });
    }

    const subject = "OTP From Stream Well"; //GIVING THE SUBJECT FOR EMAIL
    newOtp = generateOTP(); //GENERATING OTP TO SEND
    transporter.sendMail(message(email, subject, newOtp), cb); //SEND THE EMAIL IN WITH THE OTP SUBJECT
    res.status(200).json(email); //THEN RETURN THE EMAIL
  } catch (error) {
    res.status(500).send(error.message); //IF ERROR CATCH THE ERROR
  }
};

export const button = async (req, res) => {
  try {
    const { id, addUser, deleteUser, channelLimit, createChanel, deleteChanel } =
      req.body;
    console.log(req.body);

    console.log('------------------------------');

    if (!id) {
      return res.status(400).json({ message: "userId not getting" });
    }

    let obj = {
      addUser,
      deleteUser,
      channelLimit ,
      createChanel,
      deleteChanel,
    };

   const updatedUser = await User.findByIdAndUpdate({ _id: id }, { $set: obj }, { multi: true }).then((data)=>{
      console.log(data);
    })

    return res.status(200).json({ message: "Data Updated", data: updatedUser });
  } catch (err) {
    console.log(err);
  }
};

//THIS METHOS IS TO VERIFY THE OTP
export const verifyOtp = (req, res) => {
  try {
    const { token } = req.body; //GETING THE OTP FROM THE REQ.BODY
    //IF NOT GETTING THE TOKEN THEN IT WILL RETURN THE ERROR MESSAGE
    if (!token) {
      return res.status(401).json({ error: "OTP is required !" });
    }
    //if the otp is  not equal then it will return the error message
    if (token != newOtp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }
    //IF THE OTP IS SAME THEN IT WILL RETURN A SUCCESSFULLY MESSAGE
    if (token == newOtp) {
      return res.status(201).json({ message: "OTP verified successfully" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

//this methos is using for if the reseting the password
export const resetPass = async (req, res) => {
  try {
    //GETTING THE VALUE FROM REQ.BODY
    const { password, confirmPassword } = req.body;
    //IF THE PASSWORD IS NOT FOUND THEN IT WILL SEND A ERROR MESSAGE
    if (!password) {
      return res.status(403).json({ error: "Password field can't be empty" });
    }
   

    //if the confirm password and password is not same then it will return a error message
    if (password !== confirmPassword) {
      return res.status(406).json({ error: "Confirm Password doesnot match" });
    }
    //CHECKING IF CONFIRMATION PASSWORDS ARE EQUAL OR NOT
    if (password === confirmPassword) {
      const resetEmail = email;
      const encryptedPassword = hashPassword(password);
      //updating the password as well
      await User.findOneAndUpdate(
        { email: resetEmail },
        { $set: { password: encryptedPassword } },
        { new: true }
      );

      //these two variable is store all the save thats why we assign the value null after the use
      email = null;
      newOtp = null;

      return res.status(201).json({ message: "Successfully reset" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const users = async (req, res) => {
  try {
    const { id } = req.params; //IF THE ID IS GETTING FROM THE PARAMS THEN IT WILL SAVE ON THE VARIABLE ID

    //CHECKING THE CONDITION IF THERE IS NO ID THEN I WILL SHOW ALL THE USER DETAILS
    if (!id) {
      const user = await User.find({ superAdmin: false });
      return res.status(201).json({ user });
    }

    //CHECKING THECONDITION IF THE ID THEN IT WILL RETURN THE MATCHED FROM FROM THE USER LIST
    if (id) {
      const user = await User.findById(id); //GET THE USERES FROM THE MONGODB

      //CHECKING THE CONDITION IF THE USER IS NOT THERE IN THE MONGODB
      if (!user) {
        return res
          .status(401)
          .json({ error: `No such a user by this id ${id}` });
      }

      // RETURNING IF THE USER IS THERE
      return res.status(201).json({ user });
    }
  } catch (error) {
    res.status(500).json(error.message); //HANDLING THE ERROR IF THESE CODE NOT WORKING THEN IT WILL RETURN THE CATCH MATHOD AND HANDLE THE ERROR
  }
};
