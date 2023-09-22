import  express  from "express";
import { users } from "../controllers/adminController.js";


const adminRouter=express.Router();

//CREATEING THE API FOR GETING THE USERS DETAILS
adminRouter.get('/:id?',users) //DONE 





export default adminRouter;