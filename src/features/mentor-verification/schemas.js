import { z } from "zod";
import { GENDERS, GOV_ID_TYPES } from "./constants";

// Lenient "save draft" validation: types and lengths only. Completeness is checked on submit.

const str = (max) => z.string().max(max).default("").transform((s) => s.trim());
const strList = (maxItems, maxLen) =>
  z.array(z.string().max(maxLen).transform((s) => s.trim())).max(maxItems).default([]).transform((a) => a.filter(Boolean));
const month = z.string().default("").refine((v) => v === "" || /^\d{4}-(0[1-9]|1[0-2])$/.test(v), "Use the YYYY-MM format.");
const year = z.string().default("").refine((v) => v === "" || /^\d{4}$/.test(v), "Use a 4-digit year.");

const workItem = z.object({
  title: str(100),
  organization: str(120),
  location: str(100),
  startDate: month,
  endDate: month,
  current: z.boolean().default(false),
  description: str(1000),
});

const educationItem = z.object({
  degree: str(100),
  institution: str(150),
  fieldOfStudy: str(100),
  startYear: year,
  endYear: year,
  grade: str(40),
});

export const saveSchema = z.object({
  profile: z.object({
    headline: str(120),
    bio: str(2000),
    category: str(60),
    languages: strList(10, 40),
    specializations: strList(15, 60),
    mode: z.enum(["VIDEO", "PHONE", "IN_PERSON"]).default("VIDEO"),
    price: str(40),
    availability: str(120),
    yearsOfExperience: z.coerce.number().int().min(0).max(60).default(0),
  }),
  personal: z.object({
    fullName: str(100),
    phone: str(20),
    dateOfBirth: z.string().default("").refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use a valid date."),
    gender: z.string().default("").refine((v) => v === "" || GENDERS.includes(v), "Invalid value."),
    addressLine: str(200),
    city: str(80),
    state: str(80),
    pincode: str(10),
    linkedinUrl: z.string().max(200).default("").transform((s) => s.trim()).refine((v) => v === "" || /^https?:\/\//i.test(v), "Enter a full link starting with https://"),
    govIdType: z.string().default("").refine((v) => v === "" || GOV_ID_TYPES.includes(v), "Invalid value."),
  }),
  workExperience: z.array(workItem).max(20),
  education: z.array(educationItem).max(10),
  declarationAccepted: z.boolean().default(false),
});

export const reviewSchema = z.object({
  action: z.enum(["approve", "request_changes", "reject", "revoke"]),
  note: z.string().max(1000).default("").transform((s) => s.trim()),
  verifiedDocuments: z.boolean().default(false),
});
