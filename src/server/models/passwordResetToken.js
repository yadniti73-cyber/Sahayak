import mongoose from "mongoose";

const PasswordResetTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: true,
    collection: "passwordResetTokens",
  }
);

PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

PasswordResetTokenSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const PasswordResetToken = mongoose.models.PasswordResetToken || mongoose.model("PasswordResetToken", PasswordResetTokenSchema);
