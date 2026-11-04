import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    topic: { type: String, trim: true, default: "General", maxlength: 80 },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 5000 },
    rating: { type: Number, min: 1, max: 5, default: null },
  },
  { timestamps: true, collection: "feedback" }
);

FeedbackSchema.index({ createdAt: -1 });

export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
