import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: String,
  month: String,
  year: String,
  amount: Number,
});

const clientSchema = new mongoose.Schema({
  clientName: String,
  clientNumber: String,
  visits: { type: Number, default: 0 },
  tips: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  services: [serviceSchema],
});

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: String, default: "" },
    image: { type: String, default: "" },
    clients: [clientSchema],
  },
  { timestamps: true }
);

const Worker = mongoose.model("Worker", workerSchema);
export default Worker;
