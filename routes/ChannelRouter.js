import  express  from "express";
import { createChannel, deleteChannel, getChannel, preview } from "../controllers/channelController.js";
import { jwtMiddleware } from "../controllers/auth.js";
import { checkSession } from "../middleware/session.js";


const channelRouter=express.Router();

channelRouter.post('/:userId?',createChannel);
channelRouter.get("/:userId?", getChannel);
channelRouter.get('/delete/:channelId?',deleteChannel);
channelRouter.get('/preview/:channelId?', preview)



export default channelRouter;