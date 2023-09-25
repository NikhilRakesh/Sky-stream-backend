import User from "../models/userModel.js";
import CryptoJS from "crypto-js";
import { authenticator } from "otplib";
import { message, transporter, cb } from "../config/nodemailer.js";
import jwt from "jsonwebtoken";

//THE EMAIL & newOtp IS CREATED FOR RESETING THE PASSWORD ITS GLOBAL VARIABLE
let email;
let newOtp; //DONE after the use the variable want to null

//THIS METHOD IS USING FOR GENERATION THE OTP 
const generateOTP = () => {
  const secret = authenticator.generateSecret();
  const token = authenticator.generate(secret);
  return token;
};

//THIS METHOD IS USING FOR GENERATE A ENCRYPTED PASSWORD
const hashPassword = async (pass) => {
  return CryptoJS.AES.encrypt(pass, process.env.SECRET_KEY).toString();
};


//THIS METHOD IS USING FOR DECRYPT THE PASSWORD
const decryptPassword = async (pass) => {
  const bytes = CryptoJS.AES.decrypt(pass, process.env.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};


export const userCreation = async (req, res, next) => {
  try {
    // destructure values from req.body
    const { email, password, domain, color, limit } = req.body;
    const {userID}=req.body; // This is for using the logged user id
   
    //email & password want to required
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    //checking the email id is existing or not
    const user = await User.findOne({ email: email })
    if (user) {
      return res.status(409).send({ error: "User already exists" })
    }

    //maping the name and index
    let domainList;
    if(typeof(domain)!=="string")
    {
       domainList = domain.map((name, index) => ({
        name,
        limit: limit[index],
      }));
    }
    else{
      domainList = {
        name:domain,
        limit
      }
    }
   

    //encrpting the password 
    const encryptedPassword = await hashPassword(password);


    // to find the creating user is superAdmin or Not
    let isAdmin;
    if(userID){
     
      const userData = await User.findById({_id:userID})
      
      if(userData.superAdmin == true)
      {
        isAdmin = true
      }
      else
      {
        isAdmin = false
      }
    }
    

    //assigning the data into obj for saving the mongodb
    const newUser = new User({
      
      email,
      password: encryptedPassword,
      domains: domainList,
      color: color, //DONE Destrature body color -done
      isActive: true,
      addedBy:userID, //this is the param that get the logged user
      isAdmin
      
      
    })

    // Decrypting the password for response -its testing
    const decryptedPassword = await decryptPassword(newUser.password);

    //creating the jwt token 
    const token = jwt.sign(
      { _id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' })

    //assigning the token into newUser
    newUser.token = token

    //saving the the objected data into mongodb
    newUser.save().then(()=>{
      domainList={}
    });

    newUser.password = decryptedPassword; //in the frontend the password wnt to show tha's why the password decrypting
    res.status(201).json(newUser);//sending to the fr
  } catch (error) {
    res.status(500).json({ error: error.message });//IF THE CODE HAVE ERROR THE CATCH WILL HANDLE WITHOUT BLOCKING
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;  //GETTING THE VALUE FROM REQ.BODY

    //CHECKING THE EMAIL OR PASSWORD IS NULL THEN IT WILL SEND A MESSAGE
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Bad Request: Email and password are required" });
    }

    //GETTING THE USERS FROM THE MONGO EMAIL WITH THE EMAIL ID
    const user = await User.findOne({ email: email });

    //IF THERE IS NOT USER THEN IT WILL SHOW THE MESSAGE 
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid credentials" });
    }
    

    // Decrypt the stored hashed password
    const decryptedStoredPassword = await decryptPassword(user.password);

    // DONE :Refactor the below  -done

    //CHECKING THE PASSWORD IS CORECT OR NOT FOR LOGIN
    if (password === decryptedStoredPassword) {
      return res.status(200).json({ message: "Login successful", user }); //DONE usedate is not found in response  -Done
    }

    //IF THE PASSWORD IS NOT SAME THEN IT WILL RETUN THE IN VALID MESSAGE
    if (password !== decryptedStoredPassword) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//THIS IS FOR RESETING THE PASSWORD 
//FIRST WE WANT TO GET THE EMAIL WHICH IS TO RESET THE PASSWORD
export const verifyEmail = async (req, res) => {
  try {
    email = req.body.email; //GETTNG THE EMAIL FROM THE REQ.BODY
    //IF THERE NO EMAIL IN THE REQ.BODY THEN IT WILL RETURN THE ERROR MESSAGE
    if (!email) {
      return res.status(404).json({ error: "Email is Requireded" });
    }
    const user = await User.findOne({ email: email });//GETTING THE USER FROM THE MONGODB WITH THE EMAIL
    //IF HERE THE USER IS ENTER THE WRONG EMAIL OR NOT IN THE DB THEN SHOW THE ERROR
    if (!user) {
      return res.status(400).json({ error: "Email is not getting" });
    }
  
    const subject = "OTP From Stream Well"; //GIVING THE SUBJECT FOR EMAIL
    newOtp = generateOTP(); //GENERATING OTP TO SEND
    transporter.sendMail(message(email, subject, newOtp), cb);//SEND THE EMAIL IN WITH THE OTP SUBJECT 
    res.status(200).json(email);//THEN RETURN THE EMAIL
  } catch (error) {
    res.status(500).send(error.message);//IF ERROR CATCH THE ERROR
  }
};



export const button = async(req,res) =>{
  try {
    
    const userId = req.body.id // pass userid from the frontend
    if(!userId)
    {
      return res.status(400).json({message:"userId not getting"})
    }
   let obj = {
    addUser : false,
    deleteUser: false,
    chanelLimit: false,
    createChanel:false,
    deleteChanel:false
   }
  //! addUser_ON, deleteUser_ON, chanelLimit_ON, createChannel_ON, deleteChannel_ON  These are the input from the frontend buttons -----------------------------------
   
   if(req.body.addUser === "addUser_ON")
   {
    obj.addUser = true
   }
   if(req.body.deleteUser === "deleteUser_ON")
   {
    obj.deleteUser = true
   }
   if(req.body.chanelLimit==="chanelLimit_ON")
   {
    obj.chanelLimit = true
   }
   if(req.body.createChanel === "createChannel_ON")
   {
    obj.createChanel = true
   }
   if(req.body.deleteChanel === "deleteChannel_ON")
   {
    obj.createChanel = true
   }

   
   await User.findByIdAndUpdate({_id:userId},{$set:obj},{multi:true})
   
   return res.status(200).json({message:"Data Updated"})

  } catch (err) {
    console.log(err); 
  }
}
 

//THIS METHOS IS TO VERIFY THE OTP
export const verifyOtp = (req, res) => {
  
  try {
    const {token} = req.body; //GETING THE OTP FROM THE REQ.BODY
    //IF NOT GETTING THE TOKEN THEN IT WILL RETURN THE ERROR MESSAGE
    if (!token) {
      return res.status(401).json({ error: "OTP is required !" });
    }
    //if the otp is  not equal then it will return the error message
    if(token!=newOtp) {
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
    //DONE DESTRUCTURE  -done

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
