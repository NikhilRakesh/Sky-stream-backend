import express from "express";
import {userCreation,userLogin,verifyEmail,verifyOtp,resetPass} from "../controllers/userController.js"

const userRouter=express.Router();

userRouter.post("/register",userCreation);
userRouter.post("/verifyLogin",userLogin);
userRouter.post("/forget",verifyEmail) //TODO path name is not valid
userRouter.post("/verifyOtp",verifyOtp);
userRouter.post("/resetPassword",resetPass)






export default userRouter;