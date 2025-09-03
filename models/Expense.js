import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    paymentMethod: { type: String, default: "" },
    imageUrl: { type: String, default: "" }, // store uploaded image URL
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
