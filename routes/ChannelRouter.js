import  express  from "express";
import { blockChannel, createChannel, deleteChannel, getChannel, preview } from "../controllers/channelController.js";
import { jwtMiddleware } from "../controllers/auth.js";
import { checkSession } from "../middleware/session.js";


const channelRouter=express.Router();

channelRouter.post('/:userId?',createChannel);
channelRouter.get("/:userId?", getChannel);
channelRouter.get('/delete/:channelId?',deleteChannel);
channelRouter.get('/preview/:channelId?', preview);
channelRouter.post('/block-channel/:channelId?',blockChannel );



export default channelRouter;