import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true }, // matches frontend
    profession: { type: String, required: true },
    email: { type: String },
    businessName: { type: String },
    services: [{ type: String }],
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
