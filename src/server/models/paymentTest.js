import mongoose from "mongoose";

// Ledger for the isolated test payment flow. Separate collection: never touches bookings.
const PaymentTestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String, default: null },
    amount: { type: Number, required: true }, // paise
    currency: { type: String, default: "INR", maxlength: 3 },
    status: { type: String, enum: ["CREATED", "PAID", "FAILED"], default: "CREATED", index: true },
    method: { type: String, default: null }, // e.g. "upi", filled after verification
    paidAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "paymentTests" }
);

export const PaymentTest = mongoose.models.PaymentTest || mongoose.model("PaymentTest", PaymentTestSchema);
