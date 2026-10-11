import crypto from "crypto";
import mongoose from "mongoose";
import { connectMongo } from "@/server/db/mongo";
import { User } from "@/server/models/user";
import { MentorProfile } from "@/server/models/mentorProfile";
import { MentorApplication } from "@/server/models/mentorApplication";
import { MentorDocument } from "@/server/models/mentorDocument";
import { Notification } from "@/server/models/notification";
import {
  APPLICATION_STATUS as S,
  DOC_TYPES,
  EDITABLE_STATUSES,
  GOV_ID_TYPES,
  MAX_DOCUMENTS,
  MAX_FILE_BYTES,
} from "@/features/mentor-verification/constants";
import { checkSubmitReadiness } from "@/features/mentor-verification/validation";
import { reviewSchema, saveSchema } from "@/features/mentor-verification/schemas";

/* ------------------------------------------------------------------ errors */

export class MentorVerificationError extends Error {
  constructor(message, status = 400, errors = []) {
    super(message);
    this.name = "MentorVerificationError";
    this.status = status;
    this.errors = errors;
  }
}

/** Maps any error thrown in this feature to an HTTP status + message + details. */
export function toHttpError(error) {
  if (error?.name === "MentorVerificationError") {
    return { status: error.status, message: error.message, errors: error.errors };
  }
  if (error?.name === "ZodError") {
    const issues = error.issues || error.errors || [];
    return {
      status: 400,
      message: "Some fields are not valid.",
      errors: issues.map((i) => ({ field: (i.path || []).join("."), message: i.message })),
    };
  }
  if (error?.message === "Unauthorized") return { status: 401, message: "Please sign in.", errors: [] };
  if (error?.message === "Forbidden") return { status: 403, message: "You do not have access to this.", errors: [] };
  console.error("[mentor-verification]", error);
  return { status: 500, message: "Something went wrong. Please try again.", errors: [] };
}

/* ----------------------------------------------------------------- helpers */

const toId = (id) => (id ? String(id) : "");
const iso = (d) => (d ? new Date(d).toISOString() : null);

function parseObjectId(id, what = "item") {
  if (!mongoose.isValidObjectId(id)) throw new MentorVerificationError(`${what} not found.`, 404);
  return new mongoose.Types.ObjectId(String(id));
}

function slugify(name) {
  const base =
    String(name || "mentor")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "mentor";
  return `${base}-${crypto.randomBytes(3).toString("hex")}`;
}

const PERSONAL_KEYS = ["fullName", "phone", "dateOfBirth", "gender", "addressLine", "city", "state", "pincode", "linkedinUrl", "govIdType"];

function pickPersonal(p = {}) {
  return Object.fromEntries(PERSONAL_KEYS.map((k) => [k, p[k] || ""]));
}

/**
 * Fingerprint of everything an admin verifies: personal info, experience,
 * education and the set of uploaded documents. Public marketing fields
 * (headline, bio, price...) are intentionally excluded.
 */
function fingerprint(app, docIds) {
  const payload = {
    personal: pickPersonal(app.personal),
    work: (app.workExperience || []).map((w) => [w.title, w.organization, w.location, w.startDate, w.endDate, !!w.current, w.description]),
    edu: (app.education || []).map((e) => [e.degree, e.institution, e.fieldOfStudy, e.startYear, e.endYear, e.grade]),
    docs: docIds.map(String).sort(),
  };
  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

async function documentMetas(profileId) {
  const docs = await MentorDocument.find({ profileId }).select("-data").sort({ createdAt: 1 }).lean();
  return docs.map((d) => ({
    id: toId(d._id),
    type: d.type,
    label: d.label || "",
    filename: d.filename || "",
    mimeType: d.mimeType,
    size: d.size,
    uploadedAt: iso(d.createdAt),
  }));
}

async function currentFingerprint(app) {
  const docs = await MentorDocument.find({ profileId: app.profileId }).select("_id").lean();
  return fingerprint(app, docs.map((d) => d._id));
}

function historyEntry(action, status, by, note = "") {
  return { action, status, by: by || null, note, at: new Date() };
}

/* -------------------------------------------------------- record bootstrap */

async function loadUser(userId) {
  const user = await User.findById(userId).lean();
  if (!user) throw new MentorVerificationError("User not found.", 404);
  return user;
}

/** Finds (or creates) the mentor's profile and application. Safe against double submits. */
async function ensureRecords(user) {
  let profile = await MentorProfile.findOne({ userId: user._id }).lean();

  for (let attempt = 0; !profile && attempt < 3; attempt += 1) {
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email.split("@")[0];
    try {
      const created = await MentorProfile.create({ userId: user._id, slug: slugify(name), name, category: "", verified: false, active: true });
      profile = created.toObject();
    } catch (error) {
      if (error?.code !== 11000) throw error;
      profile = await MentorProfile.findOne({ userId: user._id }).lean();
    }
  }
  if (!profile) throw new MentorVerificationError("Could not create your mentor profile.", 500);

  let app = await MentorApplication.findOne({ userId: user._id }).lean();
  if (!app) {
    // Profiles that were verified before this feature existed stay verified.
    const legacyApproved = Boolean(profile.verified);
    try {
      const created = await MentorApplication.create({
        userId: user._id,
        profileId: profile._id,
        status: legacyApproved ? S.APPROVED : S.DRAFT,
        approvedHash: null,
        history: [historyEntry("created", legacyApproved ? S.APPROVED : S.DRAFT, null, legacyApproved ? "Existing verified profile" : "")],
      });
      app = created.toObject();
    } catch (error) {
      if (error?.code !== 11000) throw error;
      app = await MentorApplication.findOne({ userId: user._id }).lean();
    }
  }
  return { profile, app };
}

/* -------------------------------------------------------------------- view */

function buildView({ user, profile, app, documents }) {
  const status = app?.status || (profile?.verified ? S.APPROVED : S.DRAFT);
  const personal = pickPersonal(app?.personal);
  if (!personal.fullName) personal.fullName = profile?.name || [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  if (!personal.city) personal.city = profile?.city || "";

  return {
    profileId: toId(profile?._id),
    slug: profile?.slug || "",
    email: user?.email || "",
    status,
    editable: EDITABLE_STATUSES.includes(status),
    listed: Boolean(profile?.verified && profile?.active),
    profile: {
      headline: profile?.headline || "",
      bio: profile?.bio || "",
      category: profile?.category || "",
      languages: profile?.languages || [],
      specializations: profile?.specializations || [],
      mode: profile?.mode || "VIDEO",
      price: profile?.price || "",
      availability: profile?.availability || "",
      yearsOfExperience: profile?.yearsOfExperience || 0,
    },
    personal,
    workExperience: (app?.workExperience || []).map((w) => ({
      title: w.title || "",
      organization: w.organization || "",
      location: w.location || "",
      startDate: w.startDate || "",
      endDate: w.endDate || "",
      current: Boolean(w.current),
      description: w.description || "",
    })),
    education: (app?.education || []).map((e) => ({
      degree: e.degree || "",
      institution: e.institution || "",
      fieldOfStudy: e.fieldOfStudy || "",
      startYear: e.startYear || "",
      endYear: e.endYear || "",
      grade: e.grade || "",
    })),
    declarationAccepted: Boolean(app?.declarationAccepted),
    documents: documents || [],
    review: {
      note: app?.reviewNote || "",
      submittedAt: iso(app?.submittedAt),
      reviewedAt: iso(app?.reviewedAt),
    },
    history: (app?.history || []).map((h) => ({ action: h.action, status: h.status, note: h.note || "", at: iso(h.at) })),
  };
}

/* ----------------------------------------------------- mentor: application */

/** Read-only status used by banners. Does not create anything. */
export async function getMentorVerificationStatus(userId) {
  await connectMongo();
  const [profile, app] = await Promise.all([
    MentorProfile.findOne({ userId }, { verified: 1 }).lean(),
    MentorApplication.findOne({ userId }, { status: 1, reviewNote: 1 }).lean(),
  ]);
  return {
    status: app?.status || (profile?.verified ? S.APPROVED : S.DRAFT),
    note: app?.reviewNote || "",
  };
}

export async function getMentorApplication(userId) {
  await connectMongo();
  const user = await loadUser(userId);
  const { profile, app } = await ensureRecords(user);
  return buildView({ user, profile, app, documents: await documentMetas(profile._id) });
}

function assertEditable(status) {
  if (status === S.SUBMITTED) {
    throw new MentorVerificationError("Your application is under review. You can edit it again once we reply.", 409);
  }
  if (!EDITABLE_STATUSES.includes(status)) throw new MentorVerificationError("This application cannot be edited right now.", 409);
}

/**
 * An approved mentor who changes anything the admin verified (personal info,
 * experience, education, documents) goes back to DRAFT and is taken offline
 * until re-approved. Public marketing fields stay live.
 */
async function reconcileApproval(appId) {
  const app = await MentorApplication.findById(appId).lean();
  if (!app || app.status !== S.APPROVED) return { unlisted: false };

  const hash = await currentFingerprint(app);
  if (!app.approvedHash) {
    // Verified before this feature existed: first save just records the baseline.
    await MentorApplication.updateOne({ _id: app._id }, { $set: { approvedHash: hash } });
    return { unlisted: false };
  }
  if (hash === app.approvedHash) return { unlisted: false };

  await MentorApplication.updateOne(
    { _id: app._id, status: S.APPROVED },
    { $set: { status: S.DRAFT, submittedAt: null }, $push: { history: historyEntry("edited_after_approval", S.DRAFT, app.userId, "Verified details changed; re-approval needed") } }
  );
  await MentorProfile.updateOne({ _id: app.profileId }, { $set: { verified: false, verifiedAt: null, verifiedBy: null } });
  return { unlisted: true };
}

export async function saveMentorApplication(userId, payload) {
  const parsed = saveSchema.parse({
    profile: payload?.profile ?? {},
    personal: payload?.personal ?? {},
    workExperience: payload?.workExperience ?? [],
    education: payload?.education ?? [],
    declarationAccepted: payload?.declarationAccepted ?? false,
  });

  await connectMongo();
  const user = await loadUser(userId);
  const { profile, app } = await ensureRecords(user);
  assertEditable(app.status);

  const { profile: p, personal } = parsed;
  const workExperience = parsed.workExperience.map((w) => ({ ...w, endDate: w.current ? "" : w.endDate }));

  // Atomic guard: only write while the application is still editable.
  const updated = await MentorApplication.findOneAndUpdate(
    { _id: app._id, status: { $in: EDITABLE_STATUSES } },
    { $set: { personal, workExperience, education: parsed.education, declarationAccepted: parsed.declarationAccepted } },
    { new: true }
  ).lean();
  if (!updated) assertEditable(S.SUBMITTED);

  await MentorProfile.updateOne(
    { _id: profile._id },
    {
      $set: {
        name: personal.fullName || profile.name,
        city: personal.city,
        headline: p.headline,
        bio: p.bio,
        category: p.category,
        languages: p.languages,
        specializations: p.specializations,
        mode: p.mode,
        price: p.price,
        availability: p.availability,
        yearsOfExperience: p.yearsOfExperience,
        experience: p.yearsOfExperience > 0 ? `${p.yearsOfExperience} ${p.yearsOfExperience === 1 ? "year" : "years"}` : "",
      },
    }
  );

  await reconcileApproval(app._id);
  return getMentorApplication(userId);
}

export async function submitMentorApplication(userId) {
  await connectMongo();
  const user = await loadUser(userId);
  const { profile, app } = await ensureRecords(user);

  if (app.status === S.APPROVED) throw new MentorVerificationError("You are already verified.", 409);
  assertEditable(app.status);

  const view = buildView({ user, profile, app, documents: await documentMetas(profile._id) });
  const issues = checkSubmitReadiness(view, view.documents);
  if (issues.length) {
    throw new MentorVerificationError("Your application is not complete yet.", 422, issues);
  }

  const hash = await currentFingerprint(app);
  const result = await MentorApplication.findOneAndUpdate(
    { _id: app._id, status: { $in: [S.DRAFT, S.CHANGES_REQUESTED, S.REJECTED] } },
    {
      $set: { status: S.SUBMITTED, submittedAt: new Date(), submittedHash: hash, reviewNote: "" },
      $push: { history: historyEntry("submitted", S.SUBMITTED, user._id) },
    },
    { new: true }
  ).lean();
  if (!result) throw new MentorVerificationError("Your application could not be submitted. Please refresh and try again.", 409);

  await MentorProfile.updateOne({ _id: profile._id }, { $set: { verified: false, verifiedAt: null, verifiedBy: null } });

  // Tell every active admin there is something to review.
  const admins = await User.find({ role: "ADMIN", status: "ACTIVE" }, { _id: 1 }).lean();
  if (admins.length) {
    await Notification.insertMany(
      admins.map((a) => ({
        userId: a._id,
        title: "Mentor application to review",
        message: `${view.personal.fullName || user.email} submitted their verification details.`,
        link: `/admin/mentors/${profile._id}`,
      }))
    );
  }
  return getMentorApplication(userId);
}

/* ------------------------------------------------------ mentor: documents */

function sniffMime(buf) {
  if (buf.length >= 5 && buf.subarray(0, 5).toString("latin1") === "%PDF-") return "application/pdf";
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  return null;
}

const EXT_BY_MIME = { "application/pdf": "pdf", "image/png": "png", "image/jpeg": "jpg" };

function cleanFilename(name, mime) {
  const base = String(name || "document")
    .split(/[\\/]/)
    .pop()
    .replace(/[^\w.\- ]+/g, "")
    .slice(0, 100)
    .trim();
  return base || `document.${EXT_BY_MIME[mime]}`;
}

export async function addMentorDocument(userId, { type, label = "", file }) {
  if (!DOC_TYPES[type]) throw new MentorVerificationError("Choose a valid document type.");
  if (!file || typeof file.arrayBuffer !== "function") throw new MentorVerificationError("Choose a file to upload.");
  if (!file.size) throw new MentorVerificationError("That file is empty.");
  if (file.size > MAX_FILE_BYTES) throw new MentorVerificationError("Files can be at most 4 MB.", 413);

  const cleanLabel = String(label || "").trim().slice(0, 100);
  if (type === "GOV_ID" && !GOV_ID_TYPES.includes(cleanLabel)) {
    throw new MentorVerificationError("Choose the type of government ID.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const mimeType = sniffMime(bytes); // trust the bytes, not the browser-supplied type
  if (!mimeType) throw new MentorVerificationError("Only PDF, JPG or PNG files are accepted.", 415);

  await connectMongo();
  const user = await loadUser(userId);
  const { profile, app } = await ensureRecords(user);
  assertEditable(app.status);

  const count = await MentorDocument.countDocuments({ profileId: profile._id });
  if (count >= MAX_DOCUMENTS) throw new MentorVerificationError(`You can upload at most ${MAX_DOCUMENTS} documents.`, 409);

  const doc = await MentorDocument.create({
    userId: user._id,
    profileId: profile._id,
    type,
    label: cleanLabel,
    filename: cleanFilename(file.name, mimeType),
    mimeType,
    size: bytes.length,
    data: bytes,
  });

  const { unlisted } = await reconcileApproval(app._id);
  return {
    document: { id: toId(doc._id), type, label: doc.label, filename: doc.filename, mimeType, size: doc.size, uploadedAt: iso(doc.createdAt) },
    unlisted,
  };
}

export async function removeMentorDocument(userId, docId) {
  const id = parseObjectId(docId, "Document");
  await connectMongo();
  const user = await loadUser(userId);
  const { app } = await ensureRecords(user);
  assertEditable(app.status);

  const deleted = await MentorDocument.deleteOne({ _id: id, userId: user._id });
  if (!deleted.deletedCount) throw new MentorVerificationError("Document not found.", 404);

  const { unlisted } = await reconcileApproval(app._id);
  return { unlisted };
}

/** Only the owning mentor or an admin may read a document. Anyone else gets a 404. */
export async function getDocumentForViewer(viewer, docId) {
  const id = parseObjectId(docId, "Document");
  await connectMongo();
  const doc = await MentorDocument.findById(id).lean();
  if (!doc || (viewer.role !== "ADMIN" && toId(doc.userId) !== viewer.id)) {
    throw new MentorVerificationError("Document not found.", 404);
  }
  // .lean() hands back a BSON Binary; convert to a plain Buffer for the HTTP response.
  const raw = doc.data?.buffer ?? doc.data;
  return { ...doc, data: Buffer.from(raw).subarray(0, doc.size) };
}

/* ------------------------------------------------------------------ admin */

export const ADMIN_FILTERS = ["SUBMITTED", "CHANGES_REQUESTED", "APPROVED", "REJECTED", "DRAFT"];

export async function listMentorApplications({ status = "SUBMITTED", limit = 300 } = {}) {
  await connectMongo();
  const profiles = await MentorProfile.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  const userIds = profiles.map((p) => p.userId);
  const [apps, users] = await Promise.all([
    MentorApplication.find({ userId: { $in: userIds } }, { userId: 1, status: 1, submittedAt: 1 }).lean(),
    User.find({ _id: { $in: userIds } }, { email: 1 }).lean(),
  ]);
  const appByUser = new Map(apps.map((a) => [toId(a.userId), a]));
  const emailByUser = new Map(users.map((u) => [toId(u._id), u.email]));

  const rows = profiles.map((p) => {
    const app = appByUser.get(toId(p.userId));
    return {
      id: toId(p._id),
      name: p.name,
      email: emailByUser.get(toId(p.userId)) || "",
      category: p.category || "",
      city: p.city || "",
      headline: p.headline || "",
      status: app?.status || (p.verified ? S.APPROVED : S.DRAFT),
      submittedAt: iso(app?.submittedAt),
      listed: Boolean(p.verified && p.active),
    };
  });

  const counts = Object.fromEntries(ADMIN_FILTERS.map((s) => [s, 0]));
  rows.forEach((r) => { counts[r.status] += 1; });

  const filtered = rows
    .filter((r) => r.status === status)
    .sort((a, b) => (a.submittedAt || "").localeCompare(b.submittedAt || "")); // oldest submission first
  return { counts, rows: filtered };
}

export async function getApplicationForAdmin(profileId) {
  const id = parseObjectId(profileId, "Mentor");
  await connectMongo();
  const profile = await MentorProfile.findById(id).lean();
  if (!profile) throw new MentorVerificationError("Mentor not found.", 404);
  const [user, app, documents] = await Promise.all([
    User.findById(profile.userId).lean(),
    MentorApplication.findOne({ userId: profile.userId }).lean(),
    documentMetas(profile._id),
  ]);
  return { ...buildView({ user, profile, app, documents }), hasApplication: Boolean(app) };
}

const REVIEW_RULES = {
  approve: { from: [S.SUBMITTED], to: S.APPROVED },
  request_changes: { from: [S.SUBMITTED], to: S.CHANGES_REQUESTED, noteRequired: true },
  reject: { from: [S.SUBMITTED], to: S.REJECTED, noteRequired: true },
  revoke: { from: [S.APPROVED], to: S.REJECTED, noteRequired: true },
};

const NOTIFY = {
  approve: ["You are verified", "Your mentor profile has been approved and is now visible to seekers."],
  request_changes: ["Changes requested on your application", "Please review the note from our team and submit again."],
  reject: ["Your mentor application was not approved", "Please review the note from our team. You can correct your details and apply again."],
  revoke: ["Your verification was withdrawn", "Your profile is no longer visible to seekers. Please review the note from our team."],
};

export async function reviewMentorApplication(admin, profileId, payload) {
  const { action, note, verifiedDocuments } = reviewSchema.parse(payload);
  const rule = REVIEW_RULES[action];
  if (rule.noteRequired && note.length < 5) {
    throw new MentorVerificationError("Please add a note explaining your decision (at least 5 characters).", 422);
  }
  if (action === "approve" && !verifiedDocuments) {
    throw new MentorVerificationError("Confirm that you have checked the documents before approving.", 422);
  }

  const id = parseObjectId(profileId, "Mentor");
  await connectMongo();
  const profile = await MentorProfile.findById(id).lean();
  if (!profile) throw new MentorVerificationError("Mentor not found.", 404);
  const user = await loadUser(profile.userId);
  const { app } = await ensureRecords(user);

  const filter = { _id: app._id, status: { $in: rule.from } };
  const extra = {};
  if (action === "approve") {
    const hash = await currentFingerprint(app);
    if (hash !== app.submittedHash) {
      throw new MentorVerificationError("The application changed after it was submitted. Ask the mentor to submit again.", 409);
    }
    extra.approvedHash = hash;
  }

  const updated = await MentorApplication.findOneAndUpdate(
    filter,
    {
      $set: { status: rule.to, reviewedAt: new Date(), reviewedBy: admin.id, reviewNote: note, ...extra },
      $push: { history: historyEntry(action, rule.to, admin.id, note) },
    },
    { new: true }
  ).lean();
  if (!updated) {
    throw new MentorVerificationError("This application is no longer in a state that allows that action. Refresh the page.", 409);
  }

  const verified = action === "approve";
  await MentorProfile.updateOne(
    { _id: profile._id },
    { $set: { verified, verifiedAt: verified ? new Date() : null, verifiedBy: verified ? admin.id : null } }
  );
  if (verified) await User.updateOne({ _id: user._id }, { $set: { profileCompleted: true } });

  const [title, message] = NOTIFY[action];
  await Notification.create({ userId: user._id, title, message: note ? `${message} Note: ${note}` : message, link: "/mentor/profile" });

  return getApplicationForAdmin(profileId);
}
