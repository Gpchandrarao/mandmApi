import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Create
router.post("/", createAppointment);

// Read all
router.get("/", getAppointments);

// Read single
router.get("/:id", getAppointmentById);

// Update
router.put("/:id", updateAppointment);

// Delete
router.delete("/:id", deleteAppointment);

export default router;
