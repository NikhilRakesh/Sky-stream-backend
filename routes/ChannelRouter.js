import  express  from "express";
import { createChannel, deleteChannel, getChannel } from "../controllers/channelController.js";
import { jwtMiddleware } from "../controllers/auth.js";


const channelRouter=express.Router();

channelRouter.post('/:userId?',jwtMiddleware,createChannel);
channelRouter.get("/:userId?",jwtMiddleware, getChannel);
channelRouter.get('/delete/:channelId?',jwtMiddleware,deleteChannel);



export default channelRouter;