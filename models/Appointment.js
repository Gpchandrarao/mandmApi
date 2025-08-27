import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true }, // 24-hour format
    endTime: { type: String, required: true }, // 24-hour format
    notes: { type: String },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
