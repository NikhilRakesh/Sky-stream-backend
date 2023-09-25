import express from "express";
import {
    userCreation,
    userLogin,
    verifyEmail,
    verifyOtp,
    resetPass,
    button,
    
} from "../controllers/userController.js"

const userRouter=express.Router();

userRouter.post("/register",userCreation);
userRouter.post("/verifyLogin",userLogin);
userRouter.post("/verify-email",verifyEmail); //DONE path name is not valid -done
userRouter.post("/verifyOtp",verifyOtp);
userRouter.post("/resetPassword",resetPass);
userRouter.post("/button",button);   //! addUser_ON, deleteUser_ON, chanelLimit_ON, createChannel_ON, deleteChannel_ON  These are the input from the frontend buttons -









export default userRouter;