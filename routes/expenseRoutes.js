import express from "express";
import multer from "multer";
import path from "path";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Routes
router.get("/", getExpenses);
router.post("/", upload.single("image"), createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
