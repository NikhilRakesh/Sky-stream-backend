import express from "express";
import {userCreation,userLogin,verifyEmail,verifyOtp,resetPass} from "../controllers/userController.js"

const UserRouter=express.Router();

UserRouter.post("/register",userCreation);
UserRouter.post("/verifyLogin",userLogin);
UserRouter.post("/forget",verifyEmail)
UserRouter.post("/verifyOtp",verifyOtp);
UserRouter.post("resetPassword",resetPass)






export default UserRouter;