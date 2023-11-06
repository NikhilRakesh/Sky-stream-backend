import express from 'express';
import { createDomain, deleteDomain, getDomain } from '../controllers/domainController.js';
import { jwtMiddleware } from '../controllers/auth.js';
import { checkSession } from '../middleware/session.js';
const domainRouter = express.Router();


domainRouter.post('/:userId?', createDomain)
domainRouter.get("/delete/:domainId",  deleteDomain); 
domainRouter.get('/:userId', getDomain)


export default domainRouter;