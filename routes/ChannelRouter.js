import  express  from "express";
import { createChannel, getChannel } from "../controllers/channelController.js";


const channelRouter=express.Router();

channelRouter.post('/:userId?',createChannel);
channelRouter.get("/:userId?", getChannel);



export default channelRouter;