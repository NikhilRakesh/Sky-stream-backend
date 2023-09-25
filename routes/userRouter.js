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
userRouter.post("/register",userCreation);
userRouter.post("/verifyLogin",userLogin);
userRouter.post("/verify-email",verifyEmail) //DONE path name is not valid -done
userRouter.post("/verifyOtp",verifyOtp);
userRouter.post("/resetPassword",resetPass)









export default userRouter;