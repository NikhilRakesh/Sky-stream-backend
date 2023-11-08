import express from "express";
import { addMessage, contactUs, deleteInbox, getMessage } from "../controllers/messageController.js";
import { jwtMiddleware } from "../controllers/auth.js";
import { deleteMessage } from "../controllers/messageController.js";
import { checkSession } from "../middleware/session.js";

const messageRoute = express();

messageRoute.post("/send-message/:id?",  addMessage);
messageRoute.get("/delete-message/:id?/:sendId?", deleteMessage);
messageRoute.post("/send-contact",  contactUs );
messageRoute.get('/contact', getMessage);
messageRoute.post('/delete-inbox/:userId?',deleteInbox)

export default messageRoute;
 