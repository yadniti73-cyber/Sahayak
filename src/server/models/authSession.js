import mongoose from "mongoose";

const AuthSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userAgent: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    revokedReason: { type: String, default: "" },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: true,
    collection: "authSessions",
  }
);

AuthSessionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const AuthSession = mongoose.models.AuthSession || mongoose.model("AuthSession", AuthSessionSchema);
