// Shared (client + server safe) constants for mentor verification.

export const VERIFICATION_STATUS = {
  NOT_SUBMITTED: "NOT_SUBMITTED",
  PENDING_REVIEW: "PENDING_REVIEW",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const VERIFICATION_STATUS_META = {
  NOT_SUBMITTED: { label: "Not submitted", tone: "gray" },
  PENDING_REVIEW: { label: "Pending review", tone: "amber" },
  CHANGES_REQUESTED: { label: "Changes requested", tone: "amber" },
  APPROVED: { label: "Verified", tone: "green" },
  REJECTED: { label: "Rejected", tone: "red" },
};

export const DOCUMENT_TYPES = {
  CERTIFICATE: { label: "Certificate", multiple: true },
  RESUME: { label: "Resume / CV", multiple: false },
  GOV_ID: { label: "Government ID", multiple: false },
};

export const GOV_ID_TYPES = ["Aadhaar", "PAN", "Passport", "Driving licence", "Voter ID"];

export const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024; // 5 MB per file
export const MAX_CERTIFICATES = 10;
export const ALLOWED_DOCUMENT_MIME = ["application/pdf", "image/jpeg", "image/png"];

export const SESSION_MODES = [
  { value: "VIDEO", label: "Video" },
  { value: "PHONE", label: "Phone" },
  { value: "IN_PERSON", label: "In person" },
];

export const EMPTY_EDUCATION = { degree: "", institution: "", fieldOfStudy: "", startYear: "", endYear: "", grade: "" };
export const EMPTY_EXPERIENCE = { title: "", organization: "", location: "", from: "", to: "", current: false, description: "" };
