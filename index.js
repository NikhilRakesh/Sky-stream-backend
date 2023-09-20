import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import UserRouter from "./routes/userRouter.js";
import AdminRouter from "./routes/adminRouter.js";

dotenv.config();
import mongoose from "./config/dbConfig.js";





const PORT=process.env.PORT||5000;

const app=express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/api/users",UserRouter);
app.use('/api/admin',AdminRouter);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

