import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

const VendorBillSchema = new mongoose.Schema(
  {
    vendorName: { type: String, required: true },
    vendorContact: { type: String },
    items: [ItemSchema],
    grandTotal: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("VendorBill", VendorBillSchema);
