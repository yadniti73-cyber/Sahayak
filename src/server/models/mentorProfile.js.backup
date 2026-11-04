import mongoose from "mongoose";

const MentorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    headline: { type: String, default: "" },
    // Empty while a mentor is still filling in their application (such profiles are never public).
    category: { type: String, default: "", trim: true },
    city: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    experience: { type: String, default: "" },
    price: { type: String, default: "" },
    mode: { type: String, enum: ["VIDEO", "PHONE", "IN_PERSON"], default: "VIDEO" },
    availability: { type: String, default: "" },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    yearsOfExperience: { type: Number, default: 0 },
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
// One profile per mentor account.
MentorProfileSchema.index({ userId: 1 }, { unique: true });

export const MentorProfile = mongoose.models.MentorProfile || mongoose.model("MentorProfile", MentorProfileSchema);
