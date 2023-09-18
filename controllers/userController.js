import User from "../models/userModel.js";
import CryptoJS from "crypto-js";



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
