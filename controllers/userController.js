import User from "../models/userModel.js";
import CryptoJS from "crypto-js";


const hashPassword=async(pass)=>{
    return await CryptoJS.AES.encrypt(pass, process.env.SECRET).toString();
}


export const userCreation = async (req, res, next) => {
  const { email, password ,domain,limit} = req.body;


  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const domainList = domain.map((name, index) => ({
    name,
    limit: limit[index]
  }));



  const newUser = new User({
    email: email,
    password:await hashPassword(password),
    domains:domainList,
    isActive: true,
  });

 console.log(newUser)

  newUser
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error("Error while saving user:", err);
      res.status(500).json({ error: "Error while saving user" });
    });
};
