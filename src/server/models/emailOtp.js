import mongoose from "mongoose";

// One active code per (email, purpose). Only a HASH of the code is stored.
const EmailOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    purpose: { type: String, enum: ["REGISTER"], required: true }, // add "LOGIN", "RESET" later
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true }, // code stops working
    attempts: { type: Number, default: 0 }, // wrong guesses so far
    lastSentAt: { type: Date, required: true },
    windowStart: { type: Date, required: true }, // start of the hourly send window
    sendsInWindow: { type: Number, default: 1 },
    verifiedAt: { type: Date, default: null },
    consumedAt: { type: Date, default: null },
    expireAt: { type: Date, required: true }, // TTL: Mongo deletes the document after this
  },
  { timestamps: true, collection: "emailOtps" }
);

EmailOtpSchema.index({ email: 1, purpose: 1 }, { unique: true });
EmailOtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const EmailOtp = mongoose.models.EmailOtp || mongoose.model("EmailOtp", EmailOtpSchema);
