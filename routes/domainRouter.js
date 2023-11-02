import express from 'express';
import { createDomain, deleteDomain, getDomain } from '../controllers/domainController.js';
import { jwtMiddleware } from '../controllers/auth.js';
const domainRouter = express.Router();


domainRouter.post('/:userId?', jwtMiddleware, createDomain)
domainRouter.get("/delete/:domainId", jwtMiddleware,  deleteDomain); 
domainRouter.get('/:userId', jwtMiddleware, getDomain)


export default domainRouter;