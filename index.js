import bodyParser from "body-parser";
import express from "express";           
import dotenv from "dotenv";
import morgan from "morgan";
import userRouter from "./routes/userRouter.js";
import channelRouter from "./routes/ChannelRouter.js";
import helmet from "helmet";
import cors from "cors";
// import "./server.js";    
dotenv.config();
// import mongoose from "./config/dbConfig.js";    
import StatsRouter from "./routes/statsRoute.js";
import messageRoute from "./routes/messageRouter.js";
import postRouter from "./routes/pushRouter.js";
import domainRouter from "./routes/domainRouter.js";
import authRouter from "./routes/authRouter.js";
import Channel from "./models/channelModel.js";
import connectDB from "./config/dbConfig.js";     
import nms from "./server.js";
import { setInterval } from 'timers';

export const streamKeys = [];

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    credentials: true,
    origin: [
      "https://skystream.in",
      "https://skystreamservers.com",
      "http://localhost:5173",  
      "http://localhost",
      "http://skystream.in",    
      "http://103.248.61.196:5173",
      "http://localhost:8000",
      "https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js",  
      "http://localhost:5174",
      "http://154.26.136.90:80",
      "http://skystreamservers.com",     
      "http://live.skystreamservers.com",     
    ],
  })
);

// Routes
app.use("/api/users", userRouter);
app.use("/api/channel", channelRouter);    
app.use("/api/stats", StatsRouter);           
app.use("/api/message", messageRoute);
app.use("/api/push", postRouter);  
app.use("/api/domain", domainRouter);
app.use("/api/auth", authRouter);

// Test server configuration
app.get("/", (req, res) => {     
  res.sendStatus(200);
});

export const loadStreamKeys = async () => {
  try {
    const channels = await Channel.find({ isBlocked: false });
    channels.forEach((element) => {
      if (!streamKeys.includes(element.streamKey)) { 
        streamKeys.push(element.streamKey);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
 
loadStreamKeys();

setInterval(() => {
  loadStreamKeys();
}, 1000 * 60);

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server ${process.pid} is running successfully on PORT ${PORT}`)  
  );
  nms.run();
});

setInterval(() => {
  const memoryUsage = process.memoryUsage();
  const memoryUsageGB = {
      rss: (memoryUsage.rss / (1024 * 1024 * 1024)).toFixed(2),
      heapTotal: (memoryUsage.heapTotal / (1024 * 1024 * 1024)).toFixed(2),
      heapUsed: (memoryUsage.heapUsed / (1024 * 1024 * 1024)).toFixed(2),
      external: (memoryUsage.external / (1024 * 1024 * 1024)).toFixed(2),
      arrayBuffers: (memoryUsage.arrayBuffers / (1024 * 1024 * 1024)).toFixed(2)
  };
  console.log('Memory usage (GB):', memoryUsageGB);
}, 5000);

export default app;   
