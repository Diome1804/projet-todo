import { Router } from "express";
import { HistoryController } from "../controllers/HistoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, HistoryController.list);

export default router;
