import Appointment from "../models/Appointment.js";

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({
      date: 1,
      startTime: 1,
    });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return the updated document
    );
    if (!updatedAppointment)
      return res.status(404).json({ error: "Appointment not found" });
    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );
    if (!deletedAppointment)
      return res.status(404).json({ error: "Appointment not found" });
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
