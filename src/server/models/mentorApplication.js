import mongoose from "mongoose";

// Private verification data for a mentor. Deliberately NOT part of MentorProfile,
// so it can never leak through the public mentor APIs.

const WorkSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    organization: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, default: "" }, // YYYY-MM
    endDate: { type: String, default: "" }, // YYYY-MM
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const EducationSchema = new mongoose.Schema(
  {
    degree: { type: String, default: "" },
    institution: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    startYear: { type: String, default: "" },
    endYear: { type: String, default: "" },
    grade: { type: String, default: "" },
  },
  { _id: false }
);

const HistorySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    status: { type: String, required: true },
    by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    note: { type: String, default: "" },
    at: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const MentorApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "MentorProfile", required: true },
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "CHANGES_REQUESTED", "APPROVED", "REJECTED"],
      default: "DRAFT",
    },
    personal: {
      fullName: { type: String, default: "" },
      phone: { type: String, default: "" },
      dateOfBirth: { type: String, default: "" }, // YYYY-MM-DD
      gender: { type: String, default: "" },
      addressLine: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      linkedinUrl: { type: String, default: "" },
      govIdType: { type: String, default: "" },
    },
    workExperience: { type: [WorkSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    declarationAccepted: { type: Boolean, default: false },

    submittedAt: { type: Date, default: null },
    submittedHash: { type: String, default: null }, // fingerprint of what was submitted
    approvedHash: { type: String, default: null }, // fingerprint of what the admin approved
    reviewedAt: { type: Date, default: null },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewNote: { type: String, default: "" },
    history: { type: [HistorySchema], default: [] },
  },
  { timestamps: true, collection: "mentorApplications" }
);

MentorApplicationSchema.index({ userId: 1 }, { unique: true });
MentorApplicationSchema.index({ profileId: 1 });
MentorApplicationSchema.index({ status: 1, submittedAt: 1 });

export const MentorApplication =
  mongoose.models.MentorApplication || mongoose.model("MentorApplication", MentorApplicationSchema);
