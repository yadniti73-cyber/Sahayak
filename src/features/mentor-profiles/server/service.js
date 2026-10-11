import mongoose from "mongoose";
import { connectMongo } from "@/server/db/mongo";
import { findUsersByRole } from "@/server/repositories/users";
import { createNotification } from "@/server/repositories/notifications";
import {
  findMentorByUserId,
  slugExists,
  updateMentorProfileById,
} from "@/server/repositories/mentorProfiles";
import { findVerificationByUserId, upsertVerification } from "@/server/repositories/mentorVerifications";
import {
  countDocumentsByType,
  createMentorDocument,
  deleteDocumentById,
  deleteDocumentsByType,
  findDocumentById,
  listDocumentMeta,
} from "@/server/repositories/mentorDocuments";
import { MentorProfile } from "@/server/models/mentorProfile";
import { decryptBuffer, encryptBuffer, sniffMime } from "@/server/security/documentCrypto";
import {
  ALLOWED_DOCUMENT_MIME,
  DOCUMENT_TYPES,
  MAX_CERTIFICATES,
  MAX_DOCUMENT_BYTES,
  VERIFICATION_STATUS as S,
} from "@/features/mentor-profiles/constants";
import { applicationDraftSchema, validateForSubmission } from "@/features/mentor-profiles/validators";

const oid = (id) => new mongoose.Types.ObjectId(String(id));

export class HttpError extends Error {
  constructor(message, status = 400, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/** Legacy profiles (created before verification existed) have no status field. */
export function effectiveStatus(profile) {
  return profile?.verificationStatus && profile.verificationStatus !== S.NOT_SUBMITTED
    ? profile.verificationStatus
    : profile?.verified
      ? S.APPROVED
      : S.NOT_SUBMITTED;
}

function slugify(text) {
  return String(text || "mentor")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "mentor";
}

/** Every mentor account gets a (hidden, unverified) profile the first time it is needed. */
export async function getOrCreateMentorProfile(user) {
  await connectMongo();
  const existing = await findMentorByUserId(user.id);
  if (existing) return existing;

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "New mentor";
  const base = slugify(name);
  let slug = base;
  for (let i = 0; i < 5 && (await slugExists(slug)); i += 1) {
    slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }

  try {
    const created = await new MentorProfile({ userId: user.id, name, slug, verified: false, verificationStatus: S.NOT_SUBMITTED }).save();
    return created.toObject();
  } catch (error) {
    // Two requests raced to create the profile (unique index on userId) - use the winner.
    const winner = await findMentorByUserId(user.id);
    if (winner) return winner;
    throw error;
  }
}

function prefillFromProfile(user, profile) {
  const years = parseInt(profile?.experience, 10);
  return {
    personal: { fullName: profile?.name || [user.firstName, user.lastName].filter(Boolean).join(" "), city: profile?.city || "" },
    profile: {
      headline: profile?.headline || "",
      bio: profile?.bio || "",
      category: profile?.category || "",
      experienceYears: Number.isNaN(years) ? "" : String(years),
      price: profile?.price || "",
      mode: profile?.mode || "VIDEO",
      availability: profile?.availability || "",
      languages: profile?.languages || [],
      specializations: profile?.specializations || [],
    },
    education: [],
    experience: [],
    govIdType: "",
    declaration: false,
  };
}

const docView = (d) => ({
  id: String(d._id),
  type: d.type,
  name: d.originalName,
  mimeType: d.mimeType,
  size: d.size,
  uploadedAt: d.createdAt ? new Date(d.createdAt).toISOString() : "",
});

/** Everything the mentor's profile page needs, as plain serialisable data. */
export async function getMentorApplication(user) {
  const profile = await getOrCreateMentorProfile(user);
  const [verification, docs] = await Promise.all([findVerificationByUserId(user.id), listDocumentMeta(oid(user.id))]);

  const application = verification
    ? {
        personal: { ...prefillFromProfile(user, profile).personal, ...stripEmpty(verification.personal) },
        profile: { ...prefillFromProfile(user, profile).profile, ...stripEmpty(verification.profile) },
        education: verification.education || [],
        experience: verification.experience || [],
        govIdType: verification.govIdType || "",
        declaration: Boolean(verification.declaration),
      }
    : prefillFromProfile(user, profile);

  return {
    profileId: String(profile._id),
    slug: profile.slug,
    status: effectiveStatus(profile),
    verified: Boolean(profile.verified),
    reviewerNote: verification?.reviewerNote || "",
    submittedAt: verification?.submittedAt ? new Date(verification.submittedAt).toISOString() : "",
    locked: effectiveStatus(profile) === S.PENDING_REVIEW,
    application: JSON.parse(JSON.stringify(application)),
    documents: docs.map(docView),
  };
}

function stripEmpty(obj = {}) {
  const o = obj.toObject ? obj.toObject() : obj;
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== "" && v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)));
}

async function loadEditableContext(user) {
  const profile = await getOrCreateMentorProfile(user);
  if (effectiveStatus(profile) === S.PENDING_REVIEW) {
    throw new HttpError("Your application is under review and cannot be edited right now.", 409);
  }
  return profile;
}

/** Save (or autosave) the application as a draft. Never changes what seekers see. */
export async function saveApplicationDraft(user, payload) {
  await connectMongo();
  const parsed = applicationDraftSchema.safeParse(payload);
  if (!parsed.success) {
    throw new HttpError("Some fields are invalid.", 422, parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`));
  }
  const profile = await loadEditableContext(user);
  const d = parsed.data;

  await upsertVerification(oid(user.id), profile._id, {
    personal: d.personal,
    profile: d.profile,
    education: d.education,
    experience: d.experience,
    govIdType: d.govIdType,
    declaration: d.declaration,
  });
  return getMentorApplication(user);
}

export async function submitApplication(user, payload) {
  await connectMongo();
  if (payload) await saveApplicationDraft(user, payload);

  const profile = await loadEditableContext(user);
  const verification = await findVerificationByUserId(user.id);
  if (!verification) throw new HttpError("Fill in the application before submitting.", 422);

  const docCounts = await countDocumentsByType(oid(user.id));
  const problems = validateForSubmission(JSON.parse(JSON.stringify(verification)), docCounts);
  if (problems.length) throw new HttpError("Please fix the following before submitting.", 422, problems);

  const now = new Date();
  await upsertVerification(
    oid(user.id),
    profile._id,
    { status: S.PENDING_REVIEW, submittedAt: now, reviewerNote: "" },
    { history: { decision: "SUBMITTED", note: "", actorId: oid(user.id), at: now } }
  );
  await updateMentorProfileById(profile._id, { verificationStatus: S.PENDING_REVIEW });

  // Tell every admin there is something in the queue (best effort).
  try {
    const admins = await findUsersByRole("ADMIN");
    await Promise.all(
      admins.map((a) =>
        createNotification({
          userId: a._id,
          title: "New mentor application",
          message: `${verification.personal?.fullName || "A mentor"} submitted a verification application.`,
          link: `/admin/mentors/${profile._id}`,
        })
      )
    );
  } catch {
    /* notification failure must not fail the submission */
  }
  return getMentorApplication(user);
}

/* --------------------------------------------------------------- documents */

export async function uploadMentorDocument(user, { type, file }) {
  await connectMongo();
  if (!DOCUMENT_TYPES[type]) throw new HttpError("Unknown document type.", 422);
  if (!file || typeof file.arrayBuffer !== "function") throw new HttpError("No file received.", 422);
  if (file.size > MAX_DOCUMENT_BYTES) throw new HttpError("File is too large (max 5 MB).", 413);
  if (file.size === 0) throw new HttpError("The file is empty.", 422);

  await loadEditableContext(user);

  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = sniffMime(buffer);
  if (!mime || !ALLOWED_DOCUMENT_MIME.includes(mime)) throw new HttpError("Only PDF, JPG or PNG files are allowed.", 415);

  const userId = oid(user.id);
  if (DOCUMENT_TYPES[type].multiple) {
    const counts = await countDocumentsByType(userId);
    if ((counts[type] || 0) >= MAX_CERTIFICATES) throw new HttpError(`You can upload up to ${MAX_CERTIFICATES} certificates.`, 422);
  } else {
    // Single-file slots (resume, government ID): a new upload replaces the old one.
    await deleteDocumentsByType(userId, type);
  }

  const { iv, authTag, data } = encryptBuffer(buffer);
  const safeName = String(file.name || "document").replace(/[^\w.\- ]+/g, "_").slice(0, 120);
  const saved = await createMentorDocument({ userId, type, originalName: safeName, mimeType: mime, size: buffer.length, iv, authTag, data });
  return docView(saved);
}

export async function deleteMentorDocument(user, documentId) {
  await connectMongo();
  if (!mongoose.isValidObjectId(documentId)) throw new HttpError("Document not found.", 404);
  await loadEditableContext(user);
  const doc = await findDocumentById(documentId);
  if (!doc || String(doc.userId) !== String(user.id)) throw new HttpError("Document not found.", 404);
  await deleteDocumentById(documentId);
  return { id: documentId };
}

/** Owner or admin only. Returns decrypted bytes + headers info. */
export async function getDocumentForDownload(viewer, documentId) {
  await connectMongo();
  if (!mongoose.isValidObjectId(documentId)) throw new HttpError("Document not found.", 404);
  const doc = await findDocumentById(documentId);
  if (!doc) throw new HttpError("Document not found.", 404);
  if (viewer.role !== "ADMIN" && String(doc.userId) !== String(viewer.id)) throw new HttpError("Document not found.", 404);
  return { buffer: decryptBuffer(doc), mimeType: doc.mimeType, name: doc.originalName };
}
