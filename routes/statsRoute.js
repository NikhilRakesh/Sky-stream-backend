import express from "express";
import { getLiveNow, getStreamStats, getSystemStats } from "../controllers/statsController.js";

const StatsRouter = express.Router();


StatsRouter.get("/stream", getStreamStats)
StatsRouter.get("/system", getSystemStats)
StatsRouter.get("/live-now/:userId", getLiveNow);


export default StatsRouter;