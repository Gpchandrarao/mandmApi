import mongoose from "mongoose";

const ProductBillSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerMobile: { type: String, required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        total: Number,
      },
    ],
    date: { type: Date, default: Date.now },
    grandTotal: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ProductBill", ProductBillSchema);
