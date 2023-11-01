import User from "../models/userModel.js";
import { authenticator } from "otplib";
import { message, transporter, cb } from "../config/nodemailer.js";
import jwt from "jsonwebtoken";

let email;
let newOtp;
const generateOTP = () => {
  const secret = authenticator.generateSecret();
  const token = authenticator.generate(secret);
  return token;
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
    } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Authorized user not found" });
    }

    const userData = await User.findById({ _id: id });

    if (!userData.addUser) {
      return res.status(409).json({ error: "Not Authorized" });
    }

    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(409).send({ error: "User already exists" });
    }

  
    let isAdmin;
    if (id) {
      const userData = await User.findById({ _id: id });
      if (userData.superAdmin == true) {
        isAdmin = true;
      } else {
        isAdmin = false;
      }
    }

    const newUser = new User({
      name,
      email,
      password: password,
      domain,
      color: color,
      isActive: true,
      addedBy: id, 
      isAdmin,
      domain,
      addUser,
      deleteUser,
      createChannel,
      deleteChannel,
      expiryDate,
      channelLimit:limit,
    });

    newUser.save().then(() => {
    }).then().catch((err)=>console.log(err))

    newUser.password = password;
    res
      .status(201)
      .json({ message: "User created successfully", data: newUser });
  } catch (error) {
    console.log(error.message)
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

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    user.password = null;

    res
      .cookie(String(user._id), token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        httpOnly: true,
        sameSite: "lax",
      })
      .status(200)
      .json({ message: "Login successful", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



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

export const updateUserPermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...updateData } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "User ID is missing", data: req.body });
    }

    // Check if the user with the given ID exists
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's permissions
    await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, multi: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Update failed", error: err.message });
        }

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        res
          .status(200)
          .json({ message: "User data updated", data: updatedUser });
      }
    );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
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
    const { id } = req.params;
    let user;

    if (!id) {
      user = await User.find({ superAdmin: true }).sort({
        createdAt: -1,
      });
      return res.status(201).json({ user });
    }

    user = await User.findById({ _id: id }).sort({
      createdAt: -1,
    });

    if (!user.superAdmin) {
      user = await User.find({ addedBy: id }).sort({
        createdAt: -1,
      });

      if (!user) {
        return res
          .status(401)
          .json({ error: `No such a user by this id ${id}` });
      }

      return res.status(201).json({ user });
    }

    user = await User.find({ superAdmin: false }).sort({
      createdAt: -1,
    });

    return res.status(201).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};


export const deleteUser = async (req, res) => {
  try {
    
    const { id ,userId } = req.params;


    if (!id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const admin = await User.findById({ _id: id });

    if(!admin.deleteUser){
      return res.status(401).json({message:"Not Authorized to delete"})
    }

    if(!userId){
      return res.status(401).json({message:"User Id not found"})
    }

    await User.findByIdAndDelete({ _id: userId }).then((data) => {
      res.status(204).json({ message: "No Content" });
    }).catch((err)=>console.log(err.message))

    
  } catch (error) {
    
    res.status(500).json({ message: "Internal Server error" });

  }
}


export const getUser = async (req, res) => {
  console.log("get user")
  try {
    
    const id  = req.id

    console.log(id,"------------------------------------------")

    // await User.findById({ _id: id }, "-password")
    //   .then((data) => {
    //     return res.status(200).json({ message: "User found", data });
    //   })
    //   .catch((err) => console.log(err.message));  

  } catch (error) {
    
    console.log(error.message)

    res.status(500).json({ message: "Internal Server error" });
  }
}