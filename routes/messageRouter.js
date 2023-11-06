import express from "express";
import { addMessage, contactUs, getMessage } from "../controllers/messageController.js";
import { jwtMiddleware } from "../controllers/auth.js";
import { deleteMessage } from "../controllers/messageController.js";
import { checkSession } from "../middleware/session.js";

const messageRoute = express();

messageRoute.post("/send-message/:id?",  addMessage);
messageRoute.get("/delete-message/:id?/:sendId?", deleteMessage);
messageRoute.post("/send-contact",  contactUs );
messageRoute.get('/contact', getMessage);

export default messageRoute;
 