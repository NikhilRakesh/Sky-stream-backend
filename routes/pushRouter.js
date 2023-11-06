import express from "express";
import { deletePush, getPush, pushStream } from "../controllers/pushController.js";
import { jwtMiddleware } from "../controllers/auth.js";
import { checkSession } from "../middleware/session.js";

const postRouter = express.Router();

postRouter.get('/delete/:channelId?', deletePush);

postRouter.post("/:userId?/:channelId?",  pushStream);

postRouter.get("/:channelId?",  getPush);

export default postRouter;


 