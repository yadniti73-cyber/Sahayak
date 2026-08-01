import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, default: "" },
    link: { type: String, default: "" },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: false,
    collection: "notifications",
  }
);

NotificationSchema.index({ userId: 1, read: 1 });

export const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
