import express from "express";
import {
    userCreation,
    userLogin,
    verifyEmail,
    verifyOtp,
    resetPass,
    users,
    button,
    
} from "../controllers/userController.js"

const userRouter=express.Router();

userRouter.get('/:id?',users)
userRouter.post("/create-user",userCreation);
userRouter.post("/verify-login",userLogin);
userRouter.post("/forget-password",verifyEmail); //DONE path name is not valid -done
userRouter.post("/verify-otp",verifyOtp);
userRouter.post("/reset-password",resetPass);
userRouter.post("/button",button);   //! addUser_ON, deleteUser_ON, chanelLimit_ON, createChannel_ON, deleteChannel_ON  These are the input from the frontend buttons -



 





export default userRouter;