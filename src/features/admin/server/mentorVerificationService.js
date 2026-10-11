import mongoose from "mongoose";
import { connectMongo } from "@/server/db/mongo";
import { findMentorById, findMentorsForAdmin, updateMentorProfileById } from "@/server/repositories/mentorProfiles";
import { findVerificationByProfileId, upsertVerification } from "@/server/repositories/mentorVerifications";
import { listDocumentMeta } from "@/server/repositories/mentorDocuments";
import { createNotification } from "@/server/repositories/notifications";
import { findUserById } from "@/server/repositories/users";
import { VERIFICATION_STATUS as S } from "@/features/mentor-profiles/constants";
import { decisionSchema } from "@/features/mentor-profiles/validators";
import { HttpError, effectiveStatus } from "@/features/mentor-profiles/server/service";

const iso = (d) => (d ? new Date(d).toISOString() : "");
const plain = (v) => JSON.parse(JSON.stringify(v ?? null));

export async function listMentorApplications({ status } = {}) {
  await connectMongo();
  const profiles = await findMentorsForAdmin({ status: status && S[status] ? status : undefined });
  const rows = profiles.map((p) => ({
    id: String(p._id),
    name: p.name,
    headline: p.headline || "",
    category: p.category || "",
    city: p.city || "",
    verified: Boolean(p.verified),
    active: Boolean(p.active),
    status: effectiveStatus(p),
    updatedAt: iso(p.updatedAt),
  }));
  // Review queue first, then everything else.
  const rank = { PENDING_REVIEW: 0, CHANGES_REQUESTED: 1, NOT_SUBMITTED: 2, REJECTED: 3, APPROVED: 4 };
  return rows.sort((a, b) => rank[a.status] - rank[b.status]);
}

export async function getMentorApplicationForAdmin(profileId) {
  await connectMongo();
  if (!mongoose.isValidObjectId(profileId)) throw new HttpError("Mentor not found.", 404);
  const profile = await findMentorById(profileId);
  if (!profile) throw new HttpError("Mentor not found.", 404);

  const [verification, user, docs] = await Promise.all([
    findVerificationByProfileId(profile._id),
    findUserById(profile.userId),
    listDocumentMeta(profile.userId),
  ]);

  return plain({
    profileId: String(profile._id),
    slug: profile.slug,
    status: effectiveStatus(profile),
    verified: Boolean(profile.verified),
    email: user?.email || "",
    accountStatus: user?.status || "",
    publicProfile: {
      name: profile.name,
      headline: profile.headline,
      category: profile.category,
      city: profile.city,
      price: profile.price,
      experience: profile.experience,
    },
    application: verification
      ? {
          personal: verification.personal,
          profile: verification.profile,
          education: verification.education,
          experience: verification.experience,
          govIdType: verification.govIdType,
          declaration: verification.declaration,
          submittedAt: iso(verification.submittedAt),
          reviewedAt: iso(verification.reviewedAt),
          reviewerNote: verification.reviewerNote,
          history: (verification.history || []).map((h) => ({ ...h, at: iso(h.at) })),
        }
      : null,
    documents: docs.map((d) => ({ id: String(d._id), type: d.type, name: d.originalName, mimeType: d.mimeType, size: d.size })),
  });
}

export async function decideOnApplication(admin, profileId, payload) {
  await connectMongo();
  const parsed = decisionSchema.safeParse(payload);
  if (!parsed.success) {
    throw new HttpError("Invalid decision.", 422, parsed.error.issues.map((i) => i.message));
  }
  const { decision, note, checklist } = parsed.data;

  if (!mongoose.isValidObjectId(profileId)) throw new HttpError("Mentor not found.", 404);
  const profile = await findMentorById(profileId);
  if (!profile) throw new HttpError("Mentor not found.", 404);
  const verification = await findVerificationByProfileId(profile._id);
  const status = effectiveStatus(profile);

  if (decision === "REVOKE") {
    if (!profile.verified) throw new HttpError("This mentor is not currently verified.", 409);
  } else if (status !== S.PENDING_REVIEW || !verification) {
    throw new HttpError("Only applications that are pending review can be decided.", 409);
  }

  const now = new Date();
  const adminId = new mongoose.Types.ObjectId(admin.id);
  let nextStatus;
  const profileUpdate = {};

  if (decision === "APPROVE") {
    nextStatus = S.APPROVED;
    const a = verification;
    const years = a.profile?.experienceYears;
    Object.assign(profileUpdate, {
      name: a.personal?.fullName || profile.name,
      headline: a.profile?.headline || "",
      bio: a.profile?.bio || "",
      category: a.profile?.category || "",
      city: a.personal?.city || "",
      experience: years !== "" && years != null ? `${years} ${Number(years) === 1 ? "yr" : "yrs"}` : "",
      price: a.profile?.price || "",
      mode: a.profile?.mode || "VIDEO",
      availability: a.profile?.availability || "",
      languages: a.profile?.languages || [],
      specializations: a.profile?.specializations || [],
      verified: true,
      verifiedAt: now,
      verifiedBy: adminId,
    });
  } else if (decision === "REQUEST_CHANGES") {
    nextStatus = S.CHANGES_REQUESTED; // listing is unchanged: an already-approved mentor stays visible
  } else {
    nextStatus = S.REJECTED; // REJECT and REVOKE both take the mentor off the portal
    profileUpdate.verified = false;
    profileUpdate.verifiedAt = null;
    profileUpdate.verifiedBy = null;
  }
  profileUpdate.verificationStatus = nextStatus;

  await updateMentorProfileById(profile._id, profileUpdate);
  await upsertVerification(
    profile.userId,
    profile._id,
    { status: nextStatus, reviewedAt: now, reviewedBy: adminId, reviewerNote: note, checklist },
    { history: { decision, note, actorId: adminId, at: now } }
  );

  const copy = {
    APPROVE: ["You are now verified", "Your profile is approved and visible to seekers on GuideShala."],
    REQUEST_CHANGES: ["Changes requested on your application", note],
    REJECT: ["Your application was not approved", note],
    REVOKE: ["Your verification was removed", note],
  }[decision];
  try {
    await createNotification({ userId: profile.userId, title: copy[0], message: copy[1], link: "/mentor/profile" });
  } catch {
    /* non-fatal */
  }

  return { profileId: String(profile._id), status: nextStatus, verified: nextStatus === S.APPROVED };
}
