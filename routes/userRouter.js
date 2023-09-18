import express from "express";
import {userCreation} from "../controllers/userController.js"

const UserRouter=express.Router();

UserRouter.post("/register",userCreation)






export default UserRouter;