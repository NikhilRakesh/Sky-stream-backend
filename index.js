import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import userRouter from "./routes/userRouter.js";
import channelRouter from './routes/ChannelRouter.js';
import helmet from 'helmet';
import cors from 'cors';
import os from 'os';
import "./server.js";
dotenv.config();
import mongoose from "./config/dbConfig.js";
import cluster from "cluster";
import StatsRouter from "./routes/statsRoute.js";
import messageRoute from "./routes/messageRouter.js";
import postRouter from "./routes/pushRouter.js";
import domainRouter from "./routes/domainRouter.js";
import authRouter from "./routes/authRouter.js";


const PORT=process.env.PORT||5000;

const app=express();
     
app.use(express.json());

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    credentials: true,
    origin: [
      "http://skystream.in",
      "http://localhost:5173",
      "https://skystream.in/",
      "http://192.168.29.169:5173/",
      "http://192.168.29.88:5173/",
      "http://localhost:8000",
      "https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js",
    ],
  })
);



// Routes
app.use("/api/users",userRouter);
app.use('/api/channel',channelRouter);
app.use("/api/stats", StatsRouter);
app.use('/api/message',messageRoute);
app.use('/api/push',postRouter)
app.use('/api/domain',domainRouter)
app.use('/api/auth',authRouter)



// Test server configuration
app.get('/', (req, res) => { 

    res.sendStatus(200);
  });


const numCpu = os.cpus().length - 2 

if (process.env.SERVER_TYPE === "production") {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < numCpu; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      console.log(`${worker.process.pid} has exited`);
      cluster.fork();
    });
  } else {
    app.listen(PORT, () =>
      console.log(
        `Server ${process.pid} is running successfully on PORT ${PORT}`
      )
    );
  }
} else {
  app.listen(PORT, () =>
    console.log(`Server ${process.pid} is running successfully on PORT ${PORT}`)
  );
}             


export default app ;
   