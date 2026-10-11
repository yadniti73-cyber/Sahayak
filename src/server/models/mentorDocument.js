import mongoose from "mongoose";

// Uploaded verification documents (resume, certificates, government ID).
// File bytes live here and are only ever served through an authenticated route
// to the owning mentor or an admin. Always query with .select("-data") unless
// you are actually serving the file.

const MentorDocumentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "MentorProfile", required: true },
    type: { type: String, enum: ["RESUME", "CERTIFICATE", "GOV_ID", "OTHER"], required: true },
    label: { type: String, default: "" },
    filename: { type: String, default: "" },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true, collection: "mentorDocuments" }
);

MentorDocumentSchema.index({ userId: 1, type: 1 });
MentorDocumentSchema.index({ profileId: 1 });

export const MentorDocument =
  mongoose.models.MentorDocument || mongoose.model("MentorDocument", MentorDocumentSchema);
