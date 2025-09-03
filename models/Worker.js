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
    workerId: { type: Number, unique: true }, // 🔹 new numeric ID
    name: { type: String, required: true },
    number: { type: String, default: "" },
    role: { type: String, default: "Staff" }, // 👈 added
    salary: { type: String, default: "0" }, // 👈 added
    joinDate: { type: Date, default: Date.now }, // 👈 added
    status: {
      type: String,
      enum: ["Active", "On Leave", "Resigned"],
      default: "Active",
    }, // 👈 added
    image: { type: String, default: "" },
    clients: [clientSchema],
  },
  { timestamps: true }
);

// Auto-increment workerId
workerSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastWorker = await mongoose
      .model("Worker")
      .findOne()
      .sort({ workerId: -1 });
    this.workerId = lastWorker ? lastWorker.workerId + 1 : 1;
  }
  next();
});

const Worker = mongoose.model("Worker", workerSchema);
export default Worker;
