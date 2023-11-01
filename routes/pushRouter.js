import express from "express";
import { deletePush, getPush, pushStream } from "../controllers/pushController.js";
import { jwtMiddleware } from "../controllers/auth.js";

const postRouter = express.Router();

postRouter.get('/delete/:channelId?',jwtMiddleware, deletePush);

postRouter.post("/:userId?/:channelId?",jwtMiddleware,  pushStream);

postRouter.get("/:channelId?",jwtMiddleware,  getPush);

export default postRouter;


 