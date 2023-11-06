import express from "express";
import {
    userCreation,
    userLogin,
    verifyEmail,
    verifyOtp,
    resetPass,
    users,
    deleteUser,
    updateUserPermission,
    changeExpiryDate,
    
} from "../controllers/userController.js"
import { jwtMiddleware } from "../controllers/auth.js";
import { checkSession } from "../middleware/session.js";

const userRouter=express.Router();

userRouter.get('/:id?', users)
userRouter.post("/:id?/create-user", userCreation);
userRouter.post("/verify-login",userLogin);
userRouter.post("/forget-password",verifyEmail); //DONE path name is not valid -done
userRouter.post("/verify-otp",verifyOtp);
userRouter.post("/reset-password",resetPass);
userRouter.post("/user-permission/:id?",  updateUserPermission);  
userRouter.get("/delete/:id?/:userId?", deleteUser);
userRouter.post(
  "/update-expiry/:adminId?/:userId?",
  
  changeExpiryDate
)

 

export default userRouter;