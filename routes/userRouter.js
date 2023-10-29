import express from "express";
import {
    userCreation,
    userLogin,
    verifyEmail,
    verifyOtp,
    resetPass,
    users,
    button,
    deleteUser,
    
} from "../controllers/userController.js"

const userRouter=express.Router();

userRouter.get('/:id?',users)
userRouter.post("/:id?/create-user",userCreation);
userRouter.post("/verify-login",userLogin);
userRouter.post("/forget-password",verifyEmail); //DONE path name is not valid -done
userRouter.post("/verify-otp",verifyOtp);
userRouter.post("/reset-password",resetPass);
userRouter.post("/user-permission/:id?",button);  
userRouter.get("/delete/:id?/:userId?",deleteUser);

// TODO Expiry Date update meathode
// TODO Message Detele methode for Super Admin
 


 





export default userRouter;