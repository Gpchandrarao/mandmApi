// routes/workerRoutes.js
import express from "express";
import {
  getAllWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkerReport,
} from "../controllers/workersController.js";
import upload from "../middleware/upload.js"; // <-- import multer

const router = express.Router();

// ✅ All Workers
router.get("/", getAllWorkers);

// ✅ Single Worker by ID
router.get("/:id", getWorkerById);

// ✅ Create Worker
router.post("/", createWorker);

// ✅ Update Worker
router.put("/:id", updateWorker);

// ✅ Delete Worker
router.delete("/:id", deleteWorker);
router.get("/:id/report", getWorkerReport);

// ✅ Create Worker with image upload
router.post("/", upload.single("image"), createWorker);

// ✅ Update Worker (optionally with new image)
router.put("/:id", upload.single("image"), updateWorker);

export default router;
