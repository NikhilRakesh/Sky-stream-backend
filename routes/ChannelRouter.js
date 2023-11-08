import  express  from "express";
import { blockChannel, createChannel, deleteChannel, getChannel } from "../controllers/channelController.js";
import { jwtMiddleware } from "../controllers/auth.js";
import { checkSession } from "../middleware/session.js";


const channelRouter=express.Router();

channelRouter.post('/:userId?',createChannel);
channelRouter.get("/:userId?", getChannel);
channelRouter.get('/delete/:channelId?',deleteChannel);
channelRouter.post('/block-channel/:channelId?',blockChannel );



export default channelRouter;