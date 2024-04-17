import express from "express";
import { blockChannel, createChannel, deleteChannel, getChannel, validateStreamKey } from "../controllers/channelController.js";
import { jwtMiddleware } from "../controllers/auth.js";
import { checkSession } from "../middleware/session.js";


const channelRouter = express.Router();

channelRouter.post('/:userId?', createChannel);
channelRouter.post('/:streamkey?', validateStreamKey);
channelRouter.get("/:userId?", getChannel);
channelRouter.get('/delete/:channelId?/:userId?', deleteChannel);
channelRouter.post('/block-channel/:channelId?', blockChannel);



export default channelRouter;