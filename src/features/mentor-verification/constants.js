// Shared (client + server safe) constants for mentor verification.

export const APPLICATION_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const STATUS_META = {
  DRAFT: { label: "Draft", tone: "gray", help: "Complete every section and submit it for review." },
  SUBMITTED: { label: "Under review", tone: "blue", help: "Our team is reviewing your details and documents. Editing is paused until we reply." },
  CHANGES_REQUESTED: { label: "Changes requested", tone: "amber", help: "Please update the items mentioned below and submit again." },
  APPROVED: { label: "Verified", tone: "green", help: "Your profile is verified and visible to seekers." },
  REJECTED: { label: "Not approved", tone: "red", help: "Your application was not approved. You can correct it and submit again." },
};

// Statuses in which a mentor may edit the application.
export const EDITABLE_STATUSES = ["DRAFT", "CHANGES_REQUESTED", "REJECTED", "APPROVED"];

export const DOC_TYPES = {
  RESUME: "Resume / CV",
  CERTIFICATE: "Certificate",
  GOV_ID: "Government ID",
  OTHER: "Other supporting document",
};

// Change this list to make a document optional / required.
export const REQUIRED_DOC_TYPES = ["RESUME", "CERTIFICATE", "GOV_ID"];

export const GOV_ID_TYPES = ["Aadhaar", "PAN", "Passport", "Driving licence", "Voter ID"];

export const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB
export const MAX_DOCUMENTS = 12;
export const ALLOWED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";

export const SESSION_MODES = [
  { value: "VIDEO", label: "Video" },
  { value: "PHONE", label: "Phone" },
  { value: "IN_PERSON", label: "In person" },
];

export const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];

export const REVIEW_ACTIONS = ["approve", "request_changes", "reject", "revoke"];

export function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
