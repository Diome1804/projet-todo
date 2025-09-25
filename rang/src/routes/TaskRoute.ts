import { Router } from "express";
import { TaskController } from "../controllers/TaskController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { UploadService } from "../services/UploadService.js";

const router = Router();
const uploadService = new UploadService();

router.get("/", authMiddleware, TaskController.getAllTasks);
router.get("/:id", authMiddleware, TaskController.getTaskById);

// Create with optional photo and audio upload
router.post("/", authMiddleware, uploadService.fields([
  { name: "photo", maxCount: 1 },
  { name: "audio", maxCount: 1 }
]), TaskController.createTask);
router.put("/:id", authMiddleware, TaskController.updateTask);
router.delete("/:id", authMiddleware, TaskController.deleteTask);
router.patch("/:id/completed", authMiddleware, TaskController.completedTask);

// Permissions delegation
router.post("/:id/permissions", authMiddleware, TaskController.grantPermission);
router.delete("/:id/permissions/:userId", authMiddleware, TaskController.revokePermission);
router.get("/:id/available-users", authMiddleware, TaskController.getAvailableUsers);

export default router;

