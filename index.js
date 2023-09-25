import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import userRouter from "./routes/userRouter.js";
import channelRouter from './routes/ChannelRouter.js'
import helmet from 'helmet'
import cors from 'cors'
import os from 'os'

dotenv.config();
import mongoose from "./config/dbConfig.js";
import cluster from "cluster";


const PORT=process.env.PORT||5000;

const app=express();

app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors())

app.use("/api/users",userRouter);
app.use('/api/channel',channelRouter);



// Test server configuration
app.get('/', (req, res) => {

    res.sendStatus(200);
  });



//[ ] MULTITHREADING CONFIGURATION

const numCpu = os.cpus().length - 2 //[ ] Taking the number of threds available


// HACK CHANGE THE SERVER_TYPE TO 'production' FOR RUNNING IN MULTIPLE THREADS 

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
