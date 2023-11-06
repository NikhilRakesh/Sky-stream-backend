import express from "express";
import { getLiveNow, getSingleLiveNow, getStreamStats, getSystemStats } from "../controllers/statsController.js";
import { jwtMiddleware } from "../controllers/auth.js";
import { checkSession } from "../middleware/session.js";


const StatsRouter = express.Router();


StatsRouter.get("/stream", getStreamStats)
StatsRouter.get("/system", getSystemStats)
StatsRouter.get("/live-now/:userId", getLiveNow);
StatsRouter.get("/live-now/single/:app?/:key?",getSingleLiveNow);


export default StatsRouter;