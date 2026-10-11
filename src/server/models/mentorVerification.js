import mongoose from "mongoose";
import { VERIFICATION_STATUS } from "@/features/mentor-profiles/constants";

const Education = new mongoose.Schema(
  { degree: String, institution: String, fieldOfStudy: String, startYear: String, endYear: String, grade: String },
  { _id: false }
);
const Experience = new mongoose.Schema(
  { title: String, organization: String, location: String, from: String, to: String, current: Boolean, description: String },
  { _id: false }
);
const Decision = new mongoose.Schema(
  {
    decision: { type: String, enum: ["SUBMITTED", "APPROVE", "REQUEST_CHANGES", "REJECT", "REVOKE"] },
    note: { type: String, default: "" },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    at: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

// One current application per mentor. Past decisions are kept in `history`.
const MentorVerificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: "MentorProfile", required: true },
    status: { type: String, enum: Object.values(VERIFICATION_STATUS), default: VERIFICATION_STATUS.NOT_SUBMITTED },
    personal: {
      fullName: { type: String, default: "" },
      phone: { type: String, default: "" },
      dateOfBirth: { type: String, default: "" },
      gender: { type: String, default: "" },
      addressLine: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      linkedinUrl: { type: String, default: "" },
    },
    profile: {
      headline: { type: String, default: "" },
      bio: { type: String, default: "" },
      category: { type: String, default: "" },
      experienceYears: { type: String, default: "" },
      price: { type: String, default: "" },
      mode: { type: String, default: "VIDEO" },
      availability: { type: String, default: "" },
      languages: [String],
      specializations: [String],
    },
    education: [Education],
    experience: [Experience],
    govIdType: { type: String, default: "" },
    declaration: { type: Boolean, default: false },
    submittedAt: { type: Date, default: null },
    reviewedAt: { type: Date, default: null },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewerNote: { type: String, default: "" },
    checklist: { identity: Boolean, education: Boolean, experience: Boolean },
    history: [Decision],
  },
  { timestamps: true, collection: "verificationSubmissions" }
);

MentorVerificationSchema.index({ status: 1, submittedAt: 1 });

export const MentorVerification =
  mongoose.models.MentorVerification || mongoose.model("MentorVerification", MentorVerificationSchema);
