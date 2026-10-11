import { DOC_TYPES, REQUIRED_DOC_TYPES } from "./constants";

// Pure functions, used by the form (to show a checklist) and by the server (to enforce it).

const filled = (v) => typeof v === "string" && v.trim().length > 0;

export function ageFromDob(dob) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob || "")) return null;
  const d = new Date(`${dob}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age -= 1;
  return age;
}

/**
 * Returns a list of { section, message } problems that block submission.
 * Empty list means the application is ready to submit.
 */
export function checkSubmitReadiness({ profile = {}, personal = {}, workExperience = [], education = [], declarationAccepted = false } = {}, documents = []) {
  const issues = [];
  const add = (section, message) => issues.push({ section, message });

  // Personal information
  if (!filled(personal.fullName)) add("personal", "Enter your full name.");
  if (!/^\+?[\d\s-]{10,15}$/.test(personal.phone || "")) add("personal", "Enter a valid phone number.");
  const age = ageFromDob(personal.dateOfBirth);
  if (age === null) add("personal", "Enter your date of birth.");
  else if (age < 18) add("personal", "Mentors must be at least 18 years old.");
  if (!filled(personal.addressLine)) add("personal", "Enter your address.");
  if (!filled(personal.city)) add("personal", "Enter your city.");
  if (!filled(personal.state)) add("personal", "Enter your state.");
  if (!filled(personal.govIdType)) add("personal", "Choose the type of government ID you will upload.");

  // Public profile
  if (!filled(profile.headline)) add("profile", "Add a professional headline.");
  if ((profile.bio || "").trim().length < 50) add("profile", "Write an About section of at least 50 characters.");
  if (!filled(profile.category)) add("profile", "Choose a category.");
  if (!(profile.languages || []).length) add("profile", "Add at least one language.");
  if (!filled(profile.price)) add("profile", "Set your session price.");
  if (!filled(profile.availability)) add("profile", "Describe your availability.");

  // Work experience
  if (!workExperience.length) add("experience", "Add at least one past work experience.");
  workExperience.forEach((w, i) => {
    const n = i + 1;
    if (!filled(w.title) || !filled(w.organization)) add("experience", `Experience ${n}: add the job title and organisation.`);
    if (!filled(w.startDate)) add("experience", `Experience ${n}: add the start month.`);
    if (!w.current && !filled(w.endDate)) add("experience", `Experience ${n}: add the end month or tick "I currently work here".`);
  });

  // Education
  if (!education.length) add("education", "Add at least one education entry.");
  education.forEach((e, i) => {
    const n = i + 1;
    if (!filled(e.degree) || !filled(e.institution)) add("education", `Education ${n}: add the degree and institution.`);
    if (!filled(e.endYear)) add("education", `Education ${n}: add the year of completion.`);
  });

  // Documents
  for (const type of REQUIRED_DOC_TYPES) {
    if (!documents.some((d) => d.type === type)) add("documents", `Upload your ${DOC_TYPES[type].toLowerCase()}.`);
  }

  if (!declarationAccepted) add("declaration", "Confirm that the information you provided is true.");

  return issues;
}
