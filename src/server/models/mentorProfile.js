import mongoose from "mongoose";

const MentorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    headline: { type: String, default: "" },
    category: { type: String, required: true, trim: true },
    city: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    experience: { type: String, default: "" },
    price: { type: String, default: "" },
    mode: { type: String, enum: ["VIDEO", "PHONE", "IN_PERSON"], default: "VIDEO" },
    availability: { type: String, default: "" },
    verified: { type: Boolean, default: false },
    languages: [{ type: String }],
    bio: { type: String, default: "" },
    specializations: [{ type: String }],
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: true,
    collection: "mentorProfiles",
  }
);

MentorProfileSchema.index({ category: 1, active: 1 });

MentorProfileSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const MentorProfile = mongoose.models.MentorProfile || mongoose.model("MentorProfile", MentorProfileSchema);
