import express from "express";
import { jwtMiddleware, refreshToken, userLogout } from "../controllers/auth.js";
import { users } from "../controllers/userController.js";

const authRouter = express.Router();


authRouter.post("/logout",jwtMiddleware,userLogout)
authRouter.post("/refresh-token", refreshToken, jwtMiddleware, users);


export default authRouter;