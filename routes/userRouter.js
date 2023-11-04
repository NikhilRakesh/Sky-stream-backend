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
    
} from "../controllers/userController.js"
import { jwtMiddleware } from "../controllers/auth.js";

const userRouter=express.Router();

userRouter.get('/:id?',jwtMiddleware, users)
userRouter.post("/:id?/create-user",jwtMiddleware, userCreation);
userRouter.post("/verify-login",userLogin);
userRouter.post("/forget-password",verifyEmail); //DONE path name is not valid -done
userRouter.post("/verify-otp",verifyOtp);
userRouter.post("/reset-password",resetPass);
userRouter.post("/user-permission/:id?", jwtMiddleware, updateUserPermission);  
userRouter.get("/delete/:id?/:userId?", jwtMiddleware,deleteUser);



// TODO Expiry Date update meathode
// TODO Message Detele methode for Super Admin
 


 





export default userRouter;