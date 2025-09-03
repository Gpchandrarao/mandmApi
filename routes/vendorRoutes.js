import express from "express";
import {
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../controllers/vendorController.js";

const router = express.Router();

router.get("/", getAllVendors);
router.post("/", createVendor);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

export default router;
