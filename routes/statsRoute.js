import express from "express";
import { getLiveNow, getStreamStats, getSystemStats } from "../controllers/statsController.js";
import { jwtMiddleware } from "../controllers/auth.js";

const StatsRouter = express.Router();


StatsRouter.get("/stream",jwtMiddleware, getStreamStats)
StatsRouter.get("/system",jwtMiddleware, getSystemStats)
StatsRouter.get("/live-now/:userId",jwtMiddleware, getLiveNow);


export default StatsRouter;