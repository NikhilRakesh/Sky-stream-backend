import  express  from "express";
import { users } from "../controllers/adminController.js";


const adminRouter=express.Router();

adminRouter.get('/users',users)




export default adminRouter;