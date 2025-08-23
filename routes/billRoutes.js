import express from "express";
import {
  uploadBill,
  getAllBills,
  getTodayBills,
  getBillsByDateRange,
  getBillsSummary,
  getBillById,
  deleteBill,
  updateBill,
} from "../controllers/billController.js";

const router = express.Router();

router.post("/upload", uploadBill);
router.get("/", getAllBills);
router.get("/today", getTodayBills);
router.get("/range", getBillsByDateRange);
router.get("/summary", getBillsSummary);
router.get("/:id", getBillById);
router.delete("/:id", deleteBill);
router.put("/:id", updateBill);

export default router;
