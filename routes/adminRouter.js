import  express  from "express";
import { users } from "../controllers/adminController.js";


const AdminRouter=express.Router();

AdminRouter.get('/users',users)




export default AdminRouter;