import express from "express";
import { addMessage, contactUs, deleteMessage, getMessage } from "../controllers/messageController.js";

const messageRoute = express();

messageRoute.post("/send-message/:id?", addMessage);
messageRoute.get("/delete-message/:id?/:sendId?", deleteMessage);
messageRoute.post("/send-contact", contactUs );
messageRoute.get('/contact',getMessage);

export default messageRoute;
 