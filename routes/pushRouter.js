import express from "express";
import { deletePush, getPush, pushStream } from "../controllers/pushController.js";

const postRouter = express.Router();

postRouter.get('/delete/:channelId?',deletePush);

postRouter.post("/:userId?/:channelId?", pushStream);

postRouter.get("/:channelId?", getPush);

export default postRouter;


 