import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seekerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    createdAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: false,
    collection: "reviews",
  }
);

ReviewSchema.index({ bookingId: 1 }, { unique: true });
ReviewSchema.index({ mentorId: 1 });

export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
