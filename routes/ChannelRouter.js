import  express  from "express";
import { createChannel } from "../controllers/channelController.js";


const channelRouter=express.Router();

channelRouter.post('/:userId?',createChannel);



export default channelRouter;