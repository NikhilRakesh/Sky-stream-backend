import express from "express";
import { addMessage, deleteMessage } from "../controllers/messageController.js";

const messageRoute = express();

messageRoute.post("/send-message/:id?", addMessage);
messageRoute.get("/delete-message/:id?/:sendId?", deleteMessage);

export default messageRoute;
