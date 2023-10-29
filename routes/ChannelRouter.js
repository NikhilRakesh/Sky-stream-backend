import  express  from "express";
import { createChannel, deleteChannel, getChannel } from "../controllers/channelController.js";


const channelRouter=express.Router();

channelRouter.post('/:userId?',createChannel);
channelRouter.get("/:userId?", getChannel);
channelRouter.get('/delete/:channelId?',deleteChannel);



export default channelRouter;