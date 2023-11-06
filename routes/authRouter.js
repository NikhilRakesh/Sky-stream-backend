import express from "express";
import { jwtMiddleware, refreshToken, userLogout } from "../controllers/auth.js";
import { users } from "../controllers/userController.js";
import { checkSession } from "../middleware/session.js";

const authRouter = express.Router();


authRouter.post("/logout",userLogout)
authRouter.post("/refresh-token", refreshToken, users);


export default authRouter;