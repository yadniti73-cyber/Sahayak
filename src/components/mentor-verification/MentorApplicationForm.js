"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, FileText, Loader2, Plus, Save, Send, Trash2, Upload } from "lucide-react";
import { Panel } from "@/components/app-primitives";
import { VerificationBanner } from "@/components/mentor-verification/VerificationBanner";
import {
  ALLOWED_EXTENSIONS,
  DOC_TYPES,
  formatBytes,
  GENDERS,
  GOV_ID_TYPES,
  MAX_FILE_BYTES,
  REQUIRED_DOC_TYPES,
  SESSION_MODES,
} from "@/features/mentor-verification/constants";
import { checkSubmitReadiness } from "@/features/mentor-verification/validation";

const emptyWork = { title: "", organization: "", location: "", startDate: "", endDate: "", current: false, description: "" };
const emptyEdu = { degree: "", institution: "", fieldOfStudy: "", startYear: "", endYear: "", grade: "" };

const splitList = (text) => text.split(",").map((s) => s.trim()).filter(Boolean);
const sensitiveSnapshot = (d) => JSON.stringify([d.personal, d.workExperience, d.education]);

function Field({ label, hint, required, children, className = "" }) {
  return (
    <label className={`grid gap-1 text-sm font-semibold text-app-text ${className}`}>
      <span>
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      {children}
      {hint ? <span className="text-xs font-normal text-app-muted">{hint}</span> : null}
    </label>
  );
}

function Section({ id, step, title, description, children }) {
  return (
    <Panel className="scroll-mt-24">
      <section id={id}>
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Step {step}</p>
          <h2 className="mt-1 text-xl font-bold text-app-text">{title}</h2>
          {description ? <p className="mt-1 text-sm text-app-muted">{description}</p> : null}
        </div>
        {children}
      </section>
    </Panel>
  );
}

function DocumentSlot({ type, documents, disabled, onUpload, onRemove }) {
  const mine = documents.filter((d) => d.type === type);
  const required = REQUIRED_DOC_TYPES.includes(type);
  const [label, setLabel] = useState(type === "GOV_ID" ? GOV_ID_TYPES[0] : "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    if (file.size > MAX_FILE_BYTES) return setError(`That file is ${formatBytes(file.size)}. The limit is 4 MB.`);
    setUploading(true);
    const problem = await onUpload({ type, label, file });
    if (problem) setError(problem);
    setUploading(false);
  }

  return (
    <div className="rounded-lg border border-app-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold">
          {mine.length ? <CheckCircle2 size={18} className="text-emerald-600" aria-hidden="true" /> : <Circle size={18} className="text-slate-300" aria-hidden="true" />}
          {DOC_TYPES[type]}
          <span className="text-xs font-normal text-app-muted">{required ? "Required" : "Optional"}</span>
        </div>
      </div>

      {mine.length ? (
        <ul className="mt-3 grid gap-2">
          {mine.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <FileText size={16} className="shrink-0 text-app-primary" aria-hidden="true" />
                <a href={`/api/mentor/documents/${d.id}`} target="_blank" rel="noopener noreferrer" className="truncate font-medium text-app-primary hover:underline">
                  {d.label ? `${d.label} - ` : ""}{d.filename}
                </a>
                <span className="shrink-0 text-xs text-app-muted">{formatBytes(d.size)}</span>
              </span>
              {!disabled ? (
                <button type="button" onClick={() => onRemove(d)} className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline">
                  <Trash2 size={14} aria-hidden="true" /> Remove
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {!disabled ? (
        <div className="mt-3 flex flex-wrap items-end gap-3">
          {type === "GOV_ID" ? (
            <Field label="ID type" className="min-w-40">
              <select className="app-input" value={label} onChange={(e) => setLabel(e.target.value)}>
                {GOV_ID_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          ) : null}
          {type === "CERTIFICATE" || type === "OTHER" ? (
            <Field label={type === "CERTIFICATE" ? "Certificate name" : "Description"} className="min-w-52 flex-1">
              <input className="app-input" maxLength={100} value={label} onChange={(e) => setLabel(e.target.value)} />
            </Field>
          ) : null}
          <input ref={fileRef} type="file" accept={ALLOWED_EXTENSIONS} className="hidden" onChange={pick} />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-app-primary hover:bg-blue-50 disabled:opacity-60"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Upload size={16} aria-hidden="true" />}
            {uploading ? "Uploading..." : mine.length ? "Add another" : "Upload file"}
          </button>
        </div>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-700" role="alert">{error}</p> : null}
    </div>
  );
}

export function MentorApplicationForm({ initial, categories = [] }) {
  const router = useRouter();
  const topRef = useRef(null);

  const [app, setApp] = useState(initial);
  const [data, setData] = useState({
    profile: { ...initial.profile, yearsOfExperience: String(initial.profile.yearsOfExperience || "") },
    personal: initial.personal,
    workExperience: initial.workExperience,
    education: initial.education,
    declarationAccepted: initial.declarationAccepted,
  });
  const [langText, setLangText] = useState(initial.profile.languages.join(", "));
  const [specText, setSpecText] = useState(initial.profile.specializations.join(", "));
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState(null); // { type: "ok" | "error", text, details? }
  const savedSensitive = useRef(sensitiveSnapshot(initial));

  const locked = !app.editable;
  const approved = app.status === "APPROVED";

  const payload = () => ({
    ...data,
    profile: {
      ...data.profile,
      languages: splitList(langText),
      specializations: splitList(specText),
      yearsOfExperience: Number(data.profile.yearsOfExperience) || 0,
    },
  });

  const issues = checkSubmitReadiness(payload(), app.documents);

  const setSection = (section, key) => (e) => setData((d) => ({ ...d, [section]: { ...d[section], [key]: e.target.value } }));
  const setItem = (section, i, key, value) =>
    setData((d) => ({ ...d, [section]: d[section].map((it, idx) => (idx === i ? { ...it, [key]: value } : it)) }));
  const addItem = (section, blank) => setData((d) => ({ ...d, [section]: [...d[section], { ...blank }] }));
  const removeItem = (section, i) => setData((d) => ({ ...d, [section]: d[section].filter((_, idx) => idx !== i) }));

  const categoryOptions = categories.includes(data.profile.category) || !data.profile.category ? categories : [data.profile.category, ...categories];

  async function request(url, options) {
    const res = await fetch(url, options);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(json.message || "Something went wrong.");
      err.details = json.errors || [];
      throw err;
    }
    return json.data;
  }

  const showError = (e) => setMsg({ type: "error", text: e.message, details: (e.details || []).map((d) => d.message).filter(Boolean) });

  async function save({ quiet = false } = {}) {
    const body = payload();
    const sensitiveChanged = sensitiveSnapshot(body) !== savedSensitive.current;
    if (approved && sensitiveChanged && !window.confirm("Changing personal details, experience or education takes your profile offline until our team approves it again. Continue?")) {
      return false;
    }
    const result = await request("/api/mentor/application", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setApp(result.application);
    savedSensitive.current = sensitiveSnapshot(body);
    if (!quiet) setMsg({ type: "ok", text: "Draft saved." });
    return true;
  }

  async function onSave() {
    setMsg(null);
    setBusy("save");
    try {
      await save();
      router.refresh();
    } catch (e) {
      showError(e);
    } finally {
      setBusy("");
    }
  }

  async function onSubmit() {
    setMsg(null);
    setBusy("submit");
    try {
      const saved = await save({ quiet: true });
      if (!saved) return;
      const result = await request("/api/mentor/application/submit", { method: "POST" });
      setApp(result.application);
      setMsg({ type: "ok", text: "Submitted. Our team will review your details and get back to you." });
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      router.refresh();
    } catch (e) {
      showError(e);
    } finally {
      setBusy("");
    }
  }

  async function onUpload({ type, label, file }) {
    if (approved && !window.confirm("Adding a document takes your profile offline until our team approves it again. Continue?")) return "";
    try {
      const form = new FormData();
      form.set("type", type);
      form.set("label", label);
      form.set("file", file);
      const result = await request("/api/mentor/documents", { method: "POST", body: form });
      const fresh = await request("/api/mentor/application");
      setApp(fresh.application);
      if (result.unlisted) router.refresh();
      return "";
    } catch (e) {
      return e.message;
    }
  }

  async function onRemove(doc) {
    if (!window.confirm(`Remove ${doc.filename}?${approved ? " Your profile will go offline until it is approved again." : ""}`)) return;
    try {
      await request(`/api/mentor/documents/${doc.id}`, { method: "DELETE" });
      const fresh = await request("/api/mentor/application");
      setApp(fresh.application);
      router.refresh();
    } catch (e) {
      showError(e);
    }
  }

  const maxDob = new Date(Date.now() - 18 * 365.25 * 864e5).toISOString().slice(0, 10);
  const issuesBySection = (s) => issues.filter((i) => i.section === s);

  return (
    <div className="grid gap-6" ref={topRef}>
      <VerificationBanner status={app.status} note={app.review.note} />

      {approved ? (
        <p className="rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-900">
          You are verified. Headline, About, price, languages and availability update immediately. Changing your personal details, experience, education or documents sends your profile back for review and hides it until it is approved again.
        </p>
      ) : null}

      <nav aria-label="Application sections" className="flex flex-wrap gap-2 text-sm">
        {[["personal", "Personal info"], ["profile", "Public profile"], ["experience", "Experience"], ["education", "Education"], ["documents", "Documents"], ["declaration", "Submit"]].map(([id, label], i) => (
          <a key={id} href={`#${id}`} className="rounded-full border border-app-border bg-white px-3 py-1.5 font-semibold text-app-text hover:border-green-500 hover:text-green-700">
            {i + 1}. {label}
          </a>
        ))}
      </nav>

      <fieldset disabled={locked} className="m-0 grid min-w-0 gap-6 border-0 p-0">
        {/* 1 ---------------------------------------------------------------- */}
        <Section id="personal" step={1} title="Personal information" description="Private. Only you and the GuideShala review team can see this.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required><input className="app-input" value={data.personal.fullName} onChange={setSection("personal", "fullName")} maxLength={100} autoComplete="name" /></Field>
            <Field label="Email" hint="Your sign-in email."><input className="app-input bg-slate-50" value={app.email} readOnly disabled /></Field>
            <Field label="Phone" required><input className="app-input" type="tel" value={data.personal.phone} onChange={setSection("personal", "phone")} maxLength={20} autoComplete="tel" /></Field>
            <Field label="Date of birth" required hint="You must be at least 18."><input className="app-input" type="date" max={maxDob} value={data.personal.dateOfBirth} onChange={setSection("personal", "dateOfBirth")} /></Field>
            <Field label="Gender">
              <select className="app-input" value={data.personal.gender} onChange={setSection("personal", "gender")}>
                <option value="">Select</option>
                {GENDERS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="LinkedIn profile"><input className="app-input" type="url" placeholder="https://" value={data.personal.linkedinUrl} onChange={setSection("personal", "linkedinUrl")} maxLength={200} /></Field>
            <Field label="Address" required className="sm:col-span-2"><input className="app-input" value={data.personal.addressLine} onChange={setSection("personal", "addressLine")} maxLength={200} autoComplete="street-address" /></Field>
            <Field label="City" required><input className="app-input" value={data.personal.city} onChange={setSection("personal", "city")} maxLength={80} autoComplete="address-level2" /></Field>
            <Field label="State" required><input className="app-input" value={data.personal.state} onChange={setSection("personal", "state")} maxLength={80} autoComplete="address-level1" /></Field>
            <Field label="PIN code"><input className="app-input" inputMode="numeric" value={data.personal.pincode} onChange={setSection("personal", "pincode")} maxLength={10} autoComplete="postal-code" /></Field>
            <Field label="Government ID you will upload" required>
              <select className="app-input" value={data.personal.govIdType} onChange={setSection("personal", "govIdType")}>
                <option value="">Select</option>
                {GOV_ID_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <p className="mt-3 text-xs text-app-muted">Do not type your ID number here. Upload the document in step 5 instead.</p>
        </Section>

        {/* 2 ---------------------------------------------------------------- */}
        <Section id="profile" step={2} title="Public profile" description="This is what seekers see on your mentor page once you are verified.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Professional headline" required className="sm:col-span-2"><input className="app-input" value={data.profile.headline} onChange={setSection("profile", "headline")} maxLength={120} placeholder="e.g. Career coach for first-generation graduates" /></Field>
            <Field label="About you" required hint={`${data.profile.bio.length}/2000 - at least 50 characters`} className="sm:col-span-2">
              <textarea className="app-input min-h-36" value={data.profile.bio} onChange={setSection("profile", "bio")} maxLength={2000} />
            </Field>
            <Field label="Category" required>
              <select className="app-input" value={data.profile.category} onChange={setSection("profile", "category")}>
                <option value="">Select</option>
                {categoryOptions.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Total years of experience"><input className="app-input" type="number" min="0" max="60" value={data.profile.yearsOfExperience} onChange={setSection("profile", "yearsOfExperience")} /></Field>
            <Field label="Languages" required hint="Separate with commas."><input className="app-input" value={langText} onChange={(e) => setLangText(e.target.value)} placeholder="English, Hindi" /></Field>
            <Field label="Specializations" hint="Separate with commas."><input className="app-input" value={specText} onChange={(e) => setSpecText(e.target.value)} placeholder="Interview prep, Resume review" /></Field>
            <Field label="Session mode">
              <select className="app-input" value={data.profile.mode} onChange={setSection("profile", "mode")}>
                {SESSION_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </Field>
            <Field label="Session price" required><input className="app-input" value={data.profile.price} onChange={setSection("profile", "price")} maxLength={40} placeholder="e.g. Rs 500 / session" /></Field>
            <Field label="Availability" required className="sm:col-span-2"><input className="app-input" value={data.profile.availability} onChange={setSection("profile", "availability")} maxLength={120} placeholder="e.g. Weekdays after 6 PM, Sat mornings" /></Field>
          </div>
        </Section>

        {/* 3 ---------------------------------------------------------------- */}
        <Section id="experience" step={3} title="Past work experience" description="List your relevant roles, most recent first. At least one is required.">
          <div className="grid gap-4">
            {data.workExperience.map((w, i) => (
              <div key={i} className="grid gap-4 rounded-lg border border-app-border p-4 sm:grid-cols-2">
                <div className="flex items-center justify-between sm:col-span-2">
                  <h3 className="font-semibold">Experience {i + 1}</h3>
                  <button type="button" onClick={() => removeItem("workExperience", i)} className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"><Trash2 size={14} aria-hidden="true" /> Remove</button>
                </div>
                <Field label="Job title" required><input className="app-input" value={w.title} maxLength={100} onChange={(e) => setItem("workExperience", i, "title", e.target.value)} /></Field>
                <Field label="Organisation" required><input className="app-input" value={w.organization} maxLength={120} onChange={(e) => setItem("workExperience", i, "organization", e.target.value)} /></Field>
                <Field label="Location"><input className="app-input" value={w.location} maxLength={100} onChange={(e) => setItem("workExperience", i, "location", e.target.value)} /></Field>
                <div className="hidden sm:block" />
                <Field label="Start month" required><input className="app-input" type="month" value={w.startDate} onChange={(e) => setItem("workExperience", i, "startDate", e.target.value)} /></Field>
                <Field label="End month" required={!w.current}><input className="app-input" type="month" disabled={w.current} value={w.current ? "" : w.endDate} onChange={(e) => setItem("workExperience", i, "endDate", e.target.value)} /></Field>
                <label className="flex items-center gap-2 text-sm sm:col-span-2">
                  <input type="checkbox" className="h-4 w-4" checked={w.current} onChange={(e) => setItem("workExperience", i, "current", e.target.checked)} />
                  I currently work here
                </label>
                <Field label="What did you do?" className="sm:col-span-2"><textarea className="app-input min-h-24" maxLength={1000} value={w.description} onChange={(e) => setItem("workExperience", i, "description", e.target.value)} /></Field>
              </div>
            ))}
            <button type="button" onClick={() => addItem("workExperience", emptyWork)} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-app-primary hover:bg-blue-50"><Plus size={16} aria-hidden="true" /> Add experience</button>
          </div>
        </Section>

        {/* 4 ---------------------------------------------------------------- */}
        <Section id="education" step={4} title="Education" description="Add your degrees and qualifications. At least one is required.">
          <div className="grid gap-4">
            {data.education.map((e, i) => (
              <div key={i} className="grid gap-4 rounded-lg border border-app-border p-4 sm:grid-cols-2">
                <div className="flex items-center justify-between sm:col-span-2">
                  <h3 className="font-semibold">Education {i + 1}</h3>
                  <button type="button" onClick={() => removeItem("education", i)} className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"><Trash2 size={14} aria-hidden="true" /> Remove</button>
                </div>
                <Field label="Degree / qualification" required><input className="app-input" value={e.degree} maxLength={100} onChange={(ev) => setItem("education", i, "degree", ev.target.value)} /></Field>
                <Field label="Institution" required><input className="app-input" value={e.institution} maxLength={150} onChange={(ev) => setItem("education", i, "institution", ev.target.value)} /></Field>
                <Field label="Field of study"><input className="app-input" value={e.fieldOfStudy} maxLength={100} onChange={(ev) => setItem("education", i, "fieldOfStudy", ev.target.value)} /></Field>
                <Field label="Grade / CGPA"><input className="app-input" value={e.grade} maxLength={40} onChange={(ev) => setItem("education", i, "grade", ev.target.value)} /></Field>
                <Field label="Start year"><input className="app-input" inputMode="numeric" placeholder="YYYY" maxLength={4} value={e.startYear} onChange={(ev) => setItem("education", i, "startYear", ev.target.value.replace(/\D/g, ""))} /></Field>
                <Field label="Year completed" required><input className="app-input" inputMode="numeric" placeholder="YYYY" maxLength={4} value={e.endYear} onChange={(ev) => setItem("education", i, "endYear", ev.target.value.replace(/\D/g, ""))} /></Field>
              </div>
            ))}
            <button type="button" onClick={() => addItem("education", emptyEdu)} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-app-primary hover:bg-blue-50"><Plus size={16} aria-hidden="true" /> Add education</button>
          </div>
        </Section>
      </fieldset>

      {/* 5: documents stay usable while editable; uploads save instantly ------ */}
      <Section id="documents" step={5} title="Documents" description="PDF, JPG or PNG, up to 4 MB each. Only you and the review team can open these files.">
        <div className="grid gap-4">
          {["RESUME", "CERTIFICATE", "GOV_ID", "OTHER"].map((type) => (
            <DocumentSlot key={type} type={type} documents={app.documents} disabled={locked} onUpload={onUpload} onRemove={onRemove} />
          ))}
        </div>
        <p className="mt-3 text-xs text-app-muted">Files upload as soon as you choose them. You do not need to save the form first.</p>
      </Section>

      <Section id="declaration" step={6} title="Review and submit">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1 h-4 w-4" disabled={locked} checked={data.declarationAccepted} onChange={(e) => setData((d) => ({ ...d, declarationAccepted: e.target.checked }))} />
          <span>I confirm that the information and documents I have provided are true and belong to me, and I agree that GuideShala may verify them.</span>
        </label>

        {!approved && !locked ? (
          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold">{issues.length ? `${issues.length} thing${issues.length === 1 ? "" : "s"} left before you can submit` : "Everything is filled in. You can submit now."}</p>
            {issues.length ? (
              <ul className="mt-2 grid gap-1 text-sm text-app-muted">
                {issues.map((i, n) => (
                  <li key={n}><a href={`#${i.section}`} className="hover:text-app-primary hover:underline">{i.message}</a></li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {msg ? (
          <div className={`mt-5 rounded-lg p-4 text-sm ${msg.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`} role={msg.type === "ok" ? "status" : "alert"}>
            <p className="font-semibold">{msg.text}</p>
            {msg.details?.length ? <ul className="mt-1 list-disc pl-5">{msg.details.map((d, n) => <li key={n}>{d}</li>)}</ul> : null}
          </div>
        ) : null}

        {!locked ? (
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={onSave} disabled={Boolean(busy)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-app-primary hover:bg-blue-50 disabled:opacity-60">
              {busy === "save" ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
              {busy === "save" ? "Saving..." : approved ? "Save changes" : "Save draft"}
            </button>
            {!approved ? (
              <button type="button" onClick={onSubmit} disabled={Boolean(busy) || issues.length > 0} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-green-600 bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
                {busy === "submit" ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
                {busy === "submit" ? "Submitting..." : app.status === "DRAFT" ? "Submit for verification" : "Resubmit for verification"}
              </button>
            ) : null}
          </div>
        ) : (
          <p className="mt-5 text-sm text-app-muted">Your application is with our review team. We will notify you as soon as there is a decision.</p>
        )}
        {app.status === "DRAFT" && approved === false && app.history?.some((h) => h.action === "edited_after_approval") ? (
          <p className="mt-3 text-xs text-app-muted">Your earlier verification was paused because verified details changed. Submit again to go live.</p>
        ) : null}
      </Section>
    </div>
  );
}
