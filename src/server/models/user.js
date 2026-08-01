import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    provider: { type: String, enum: ["local", "google"], default: "local", required: true },
    providerId: { type: String, default: null },
    pictureUrl: { type: String, default: "" },
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    role: {
      type: String,
      enum: ["SEEKER", "MENTOR", "ADMIN"],
      default: "SEEKER",
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "LOCKED"],
      default: "ACTIVE",
    },
    profileCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
