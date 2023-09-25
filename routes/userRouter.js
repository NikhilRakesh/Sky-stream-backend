import express from "express";
import {
    userCreation,
    userLogin,
    verifyEmail,
    verifyOtp,
    resetPass,
    users,
    
} from "../controllers/userController.js"

const userRouter=express.Router();

userRouter.get('/:id?',users)
userRouter.post("/create-user",userCreation);
userRouter.post("/verify-login",userLogin);
userRouter.post("/forget-password",verifyEmail) //DONE path name is not valid -done
userRouter.post("/verify-otp",verifyOtp);
userRouter.post("/reset-password",resetPass)









export default userRouter;