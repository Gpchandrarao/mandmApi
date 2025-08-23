import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    paymentType: {
      type: String,
      enum: ["Cash", "PhonePe", "Google Pay", "Both"], // ✅ Added "Both"
      required: true,
    },
    serverName: { type: String, required: true },
    tips: { type: Number, default: 0 },
    billAmount: { type: Number, required: true },
    discount: { type: String, default: "0" }, // ✅ keep string, handles "50" or "10%"
    remarks: { type: String, default: "" },
    grandTotal: { type: Number, default: 0 },

    services: [
      {
        key: String, // e.g., "1-male"
        quantity: Number,
      },
    ],

    date: {
      type: Date,
      default: () => new Date(),
    },

    referral: { type: String, default: "" },

    // ✅ New field for split payments
    paymentBreakdown: {
      cash: { type: Number, default: 0 },
      online: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
