import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";
import channelRouter from './routes/ChannelRouter.js'

dotenv.config();
import mongoose from "./config/dbConfig.js";






const PORT=process.env.PORT||5000;

const app=express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/api/users",userRouter);
app.use('/api/admin',adminRouter);
app.use('/',channelRouter);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

