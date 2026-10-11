import { z } from "zod";
import { GOV_ID_TYPES, SESSION_MODES } from "./constants";

const text = (max = 200) => z.string().trim().max(max).default("");
const year = z.string().trim().regex(/^(|\d{4})$/, "Use a 4-digit year.").default("");
const month = z.string().trim().regex(/^(|\d{4}-\d{2})$/, "Use YYYY-MM.").default("");

const educationSchema = z.object({
  degree: text(120),
  institution: text(160),
  fieldOfStudy: text(120),
  startYear: year,
  endYear: year,
  grade: text(40),
});

const experienceSchema = z.object({
  title: text(120),
  organization: text(160),
  location: text(120),
  from: month,
  to: month,
  current: z.boolean().default(false),
  description: text(1000),
});

// Draft: everything optional so a mentor can save half-finished work.
export const applicationDraftSchema = z.object({
  personal: z
    .object({
      fullName: text(120),
      phone: text(20),
      dateOfBirth: text(10),
      gender: text(30),
      addressLine: text(200),
      city: text(80),
      state: text(80),
      country: text(80),
      linkedinUrl: text(300),
    })
    .default({}),
  profile: z
    .object({
      headline: text(160),
      bio: text(3000),
      category: text(80),
      experienceYears: text(3),
      price: text(40),
      mode: z.enum(SESSION_MODES.map((m) => m.value)).default("VIDEO"),
      availability: text(160),
      languages: z.array(z.string().trim().min(1).max(40)).max(15).default([]),
      specializations: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
    })
    .default({}),
  education: z.array(educationSchema).max(10).default([]),
  experience: z.array(experienceSchema).max(15).default([]),
  govIdType: z.string().trim().max(40).default(""),
  declaration: z.boolean().default(false),
});

/**
 * Strict check run on "Submit for review". Returns a list of human-readable
 * problems (empty list = OK). `docCounts` is { CERTIFICATE: n, RESUME: n, GOV_ID: n }.
 */
export function validateForSubmission(app, docCounts = {}) {
  const problems = [];
  const p = app.personal || {};
  const pr = app.profile || {};

  if (!p.fullName?.trim()) problems.push("Full name is required.");
  if (!/^[+\d][\d\s-]{7,18}$/.test(p.phone || "")) problems.push("A valid phone number is required.");
  if (!p.dateOfBirth) problems.push("Date of birth is required.");
  else {
    const dob = new Date(p.dateOfBirth);
    const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000);
    if (Number.isNaN(dob.getTime()) || age < 18) problems.push("You must be at least 18 years old.");
  }
  if (!p.city?.trim() || !p.state?.trim() || !p.country?.trim()) problems.push("City, state and country are required.");

  if (!pr.headline?.trim()) problems.push("Professional headline is required.");
  if ((pr.bio || "").trim().length < 100) problems.push("Bio must be at least 100 characters.");
  if (!pr.category?.trim()) problems.push("Category is required.");
  if (pr.experienceYears === "" || Number.isNaN(Number(pr.experienceYears))) problems.push("Years of experience is required.");
  if (!pr.price?.trim()) problems.push("Session price is required.");
  if (!pr.languages?.length) problems.push("Add at least one language.");

  if (!app.education?.length) problems.push("Add at least one education entry.");
  app.education?.forEach((e, i) => {
    if (!e.degree || !e.institution) problems.push(`Education #${i + 1}: degree and institution are required.`);
    if (e.startYear && e.endYear && Number(e.endYear) < Number(e.startYear)) problems.push(`Education #${i + 1}: end year is before start year.`);
  });

  if (!app.experience?.length) problems.push("Add at least one past experience entry.");
  app.experience?.forEach((x, i) => {
    if (!x.title || !x.organization || !x.from) problems.push(`Experience #${i + 1}: title, organization and start date are required.`);
    if (!x.current && !x.to) problems.push(`Experience #${i + 1}: add an end date or mark it as current.`);
    if (x.from && x.to && !x.current && x.to < x.from) problems.push(`Experience #${i + 1}: end date is before start date.`);
  });

  if (!GOV_ID_TYPES.includes(app.govIdType)) problems.push("Select the type of government ID you are uploading.");
  if (!docCounts.RESUME) problems.push("Upload your resume.");
  if (!docCounts.GOV_ID) problems.push("Upload a government ID.");
  if (!docCounts.CERTIFICATE) problems.push("Upload at least one certificate.");
  if (!app.declaration) problems.push("Please accept the declaration.");

  return problems;
}

export const decisionSchema = z
  .object({
    decision: z.enum(["APPROVE", "REQUEST_CHANGES", "REJECT", "REVOKE"]),
    note: z.string().trim().max(1500).default(""),
    checklist: z
      .object({ identity: z.boolean().default(false), education: z.boolean().default(false), experience: z.boolean().default(false) })
      .default({}),
  })
  .superRefine((v, ctx) => {
    if (v.decision !== "APPROVE" && v.note.length < 5) {
      ctx.addIssue({ code: "custom", path: ["note"], message: "Please add a note explaining the decision." });
    }
    if (v.decision === "APPROVE" && !(v.checklist.identity && v.checklist.education && v.checklist.experience)) {
      ctx.addIssue({ code: "custom", path: ["checklist"], message: "Confirm identity, education and experience checks before approving." });
    }
  });
