import express from "express";
import {userCreation,userLogin} from "../controllers/userController.js"

const UserRouter=express.Router();

UserRouter.post("/register",userCreation)
UserRouter.post("/verifyLogin",userLogin)






export default UserRouter;