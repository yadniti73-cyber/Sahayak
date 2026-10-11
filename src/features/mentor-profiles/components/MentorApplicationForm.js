"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { Badge, Panel } from "@/components";
import { FormAlert } from "@/components/auth-fields";
import {
  DOCUMENT_TYPES,
  EMPTY_EDUCATION,
  EMPTY_EXPERIENCE,
  GOV_ID_TYPES,
  MAX_DOCUMENT_BYTES,
  SESSION_MODES,
  VERIFICATION_STATUS_META,
} from "../constants";

const csv = (v) => v.split(",").map((x) => x.trim()).filter(Boolean);
const fmtSize = (n) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-app-text ${className}`}>
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-app-muted">{hint}</span> : null}
    </label>
  );
}

function Section({ step, title, description, children }) {
  return (
    <Panel>
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-app-primary to-green-600 text-sm font-bold text-white">{step}</span>
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-app-muted">{description}</p>
        </div>
      </div>
      <div className="grid gap-4">{children}</div>
    </Panel>
  );
}

function StatusBanner({ status, note }) {
  const meta = VERIFICATION_STATUS_META[status] || VERIFICATION_STATUS_META.NOT_SUBMITTED;
  const text = {
    NOT_SUBMITTED: "Complete the form below and submit it. Our team reviews every application before your profile appears to seekers.",
    PENDING_REVIEW: "Your application is with our team. You can't edit it while it is being reviewed. We'll notify you of the decision.",
    CHANGES_REQUESTED: "Our team asked for some changes. Update the form and submit again.",
    APPROVED: "You are verified and visible to seekers. If you edit and re-submit, your current public profile stays live until the changes are approved.",
    REJECTED: "Your application was not approved and your profile is hidden. You can fix the issues and apply again.",
  }[status];
  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-bold">Verification status</h2>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>
      <p className="mt-2 text-sm text-app-muted">{text}</p>
      {note && (status === "CHANGES_REQUESTED" || status === "REJECTED") ? (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <span className="font-semibold">Note from reviewer: </span>{note}
        </p>
      ) : null}
    </Panel>
  );
}

function DocumentSlot({ type, docs, locked, onUploaded, onRemoved, setError }) {
  const meta = DOCUMENT_TYPES[type];
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const mine = docs.filter((d) => d.type === type);

  async function upload(file) {
    if (!file) return;
    setError("");
    if (file.size > MAX_DOCUMENT_BYTES) return setError(`${file.name} is larger than 5 MB.`);
    setBusy(true);
    try {
      const body = new FormData();
      body.append("type", type);
      body.append("file", file);
      const res = await fetch("/api/mentor/documents", { method: "POST", body, credentials: "same-origin" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Upload failed.");
      onUploaded(json.data.document);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(id) {
    setError("");
    const res = await fetch(`/api/mentor/documents/${id}`, { method: "DELETE", credentials: "same-origin" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.message || "Unable to remove the file.");
    onRemoved(id);
  }

  return (
    <div className="rounded-lg border border-app-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{meta.label}{meta.multiple ? "s" : ""}</p>
          <p className="text-xs text-app-muted">PDF, JPG or PNG, up to 5 MB{meta.multiple ? " each" : ""}.</p>
        </div>
        <button
          type="button"
          disabled={locked || busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-app-border bg-white px-3 py-2 text-sm font-semibold text-app-primary transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Upload size={16} aria-hidden="true" />}
          {mine.length && !meta.multiple ? "Replace" : "Upload"}
        </button>
        <input ref={inputRef} type="file" accept="application/pdf,image/jpeg,image/png" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} />
      </div>
      {mine.length ? (
        <ul className="mt-3 grid gap-2">
          {mine.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <a href={`/api/documents/${d.id}`} target="_blank" rel="noreferrer" className="inline-flex min-w-0 items-center gap-2 text-app-primary hover:underline">
                <FileText size={16} aria-hidden="true" />
                <span className="truncate">{d.name}</span>
                <span className="shrink-0 text-xs text-app-muted">{fmtSize(d.size)}</span>
              </a>
              {locked ? null : (
                <button type="button" onClick={() => remove(d.id)} aria-label={`Remove ${d.name}`} className="text-red-600 hover:text-red-700">
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-amber-700">Nothing uploaded yet.</p>
      )}
    </div>
  );
}

export function MentorApplicationForm({ initial }) {
  const router = useRouter();
  const [app, setApp] = useState(initial.application);
  const [docs, setDocs] = useState(initial.documents);
  const [status, setStatus] = useState(initial.status);
  const [note] = useState(initial.reviewerNote);
  const [langText, setLangText] = useState((initial.application.profile.languages || []).join(", "));
  const [specText, setSpecText] = useState((initial.application.profile.specializations || []).join(", "));
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [problems, setProblems] = useState([]);
  const [message, setMessage] = useState("");
  const locked = status === "PENDING_REVIEW";

  const setIn = (section, key, value) => setApp((a) => ({ ...a, [section]: { ...a[section], [key]: value } }));
  const setRow = (list, i, key, value) => setApp((a) => ({ ...a, [list]: a[list].map((r, idx) => (idx === i ? { ...r, [key]: value } : r)) }));
  const addRow = (list, empty) => setApp((a) => ({ ...a, [list]: [...a[list], { ...empty }] }));
  const delRow = (list, i) => setApp((a) => ({ ...a, [list]: a[list].filter((_, idx) => idx !== i) }));

  async function call(url, method, body) {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "same-origin" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      const err = new Error(json.message || "Request failed.");
      err.problems = json.errors || [];
      throw err;
    }
    return json.data;
  }

  async function run(kind) {
    setBusy(kind);
    setError("");
    setProblems([]);
    setMessage("");
    try {
      const payload = { ...app, profile: { ...app.profile, languages: csv(langText), specializations: csv(specText) } };
      const data = kind === "submit" ? await call("/api/mentor/profile/submit", "POST", payload) : await call("/api/mentor/profile", "PUT", payload);
      setStatus(data.status);
      setMessage(kind === "submit" ? "Submitted. Our team will review your application." : "Draft saved.");
      if (kind === "submit") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        router.refresh();
      }
    } catch (e) {
      setError(e.message);
      setProblems(e.problems || []);
    } finally {
      setBusy("");
    }
  }

  const fieldsetProps = { disabled: locked, className: "grid gap-6 border-0 p-0 m-0 min-w-0" };

  return (
    <div className="grid gap-6">
      <StatusBanner status={status} note={note} />

      <fieldset {...fieldsetProps}>
        <Section step="1" title="Personal information" description="Used only for verification. Your phone, date of birth and address are never shown to seekers.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name (as on your ID)"><input className="app-input" value={app.personal.fullName || ""} onChange={(e) => setIn("personal", "fullName", e.target.value)} /></Field>
            <Field label="Phone number"><input className="app-input" inputMode="tel" placeholder="+91 98765 43210" value={app.personal.phone || ""} onChange={(e) => setIn("personal", "phone", e.target.value)} /></Field>
            <Field label="Date of birth"><input className="app-input" type="date" value={app.personal.dateOfBirth || ""} onChange={(e) => setIn("personal", "dateOfBirth", e.target.value)} /></Field>
            <Field label="Gender (optional)"><input className="app-input" value={app.personal.gender || ""} onChange={(e) => setIn("personal", "gender", e.target.value)} /></Field>
          </div>
          <Field label="Address"><input className="app-input" value={app.personal.addressLine || ""} onChange={(e) => setIn("personal", "addressLine", e.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City"><input className="app-input" value={app.personal.city || ""} onChange={(e) => setIn("personal", "city", e.target.value)} /></Field>
            <Field label="State"><input className="app-input" value={app.personal.state || ""} onChange={(e) => setIn("personal", "state", e.target.value)} /></Field>
            <Field label="Country"><input className="app-input" value={app.personal.country || ""} onChange={(e) => setIn("personal", "country", e.target.value)} /></Field>
          </div>
          <Field label="LinkedIn profile (optional)"><input className="app-input" type="url" placeholder="https://linkedin.com/in/..." value={app.personal.linkedinUrl || ""} onChange={(e) => setIn("personal", "linkedinUrl", e.target.value)} /></Field>
        </Section>

        <Section step="2" title="Public profile" description="This is what seekers will see once you are approved. It goes live only after admin approval.">
          <Field label="Professional headline"><input className="app-input" placeholder="e.g. Senior product manager helping people break into tech" value={app.profile.headline || ""} onChange={(e) => setIn("profile", "headline", e.target.value)} /></Field>
          <Field label="About you and how you mentor" hint={`${(app.profile.bio || "").trim().length}/100 characters minimum`}>
            <textarea className="app-input min-h-32" value={app.profile.bio || ""} onChange={(e) => setIn("profile", "bio", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Category"><input className="app-input" placeholder="e.g. Career" value={app.profile.category || ""} onChange={(e) => setIn("profile", "category", e.target.value)} /></Field>
            <Field label="Years of experience"><input className="app-input" inputMode="numeric" value={app.profile.experienceYears || ""} onChange={(e) => setIn("profile", "experienceYears", e.target.value.replace(/\D/g, "").slice(0, 2))} /></Field>
            <Field label="Price per session"><input className="app-input" placeholder="e.g. ₹500" value={app.profile.price || ""} onChange={(e) => setIn("profile", "price", e.target.value)} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Session mode">
              <select className="app-input" value={app.profile.mode || "VIDEO"} onChange={(e) => setIn("profile", "mode", e.target.value)}>
                {SESSION_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </Field>
            <Field label="Availability"><input className="app-input" placeholder="e.g. Weekends, evenings" value={app.profile.availability || ""} onChange={(e) => setIn("profile", "availability", e.target.value)} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Languages" hint="Separate with commas"><input className="app-input" value={langText} onChange={(e) => setLangText(e.target.value)} /></Field>
            <Field label="Specializations" hint="Separate with commas"><input className="app-input" value={specText} onChange={(e) => setSpecText(e.target.value)} /></Field>
          </div>
        </Section>

        <Section step="3" title="Education" description="Add your highest qualifications first.">
          {app.education.map((row, i) => (
            <div key={i} className="grid gap-3 rounded-lg border border-app-border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Degree / qualification"><input className="app-input" value={row.degree || ""} onChange={(e) => setRow("education", i, "degree", e.target.value)} /></Field>
                <Field label="Institution"><input className="app-input" value={row.institution || ""} onChange={(e) => setRow("education", i, "institution", e.target.value)} /></Field>
                <Field label="Field of study"><input className="app-input" value={row.fieldOfStudy || ""} onChange={(e) => setRow("education", i, "fieldOfStudy", e.target.value)} /></Field>
                <Field label="Grade / CGPA (optional)"><input className="app-input" value={row.grade || ""} onChange={(e) => setRow("education", i, "grade", e.target.value)} /></Field>
                <Field label="Start year"><input className="app-input" inputMode="numeric" maxLength={4} value={row.startYear || ""} onChange={(e) => setRow("education", i, "startYear", e.target.value.replace(/\D/g, ""))} /></Field>
                <Field label="End year"><input className="app-input" inputMode="numeric" maxLength={4} value={row.endYear || ""} onChange={(e) => setRow("education", i, "endYear", e.target.value.replace(/\D/g, ""))} /></Field>
              </div>
              <button type="button" onClick={() => delRow("education", i)} className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"><Trash2 size={15} aria-hidden="true" /> Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addRow("education", EMPTY_EDUCATION)} className="inline-flex w-fit items-center gap-2 rounded-lg border border-app-border px-3 py-2 text-sm font-semibold text-app-primary hover:bg-blue-50"><Plus size={16} aria-hidden="true" /> Add education</button>
        </Section>

        <Section step="4" title="Past experience" description="Work history that backs up what you will be mentoring on.">
          {app.experience.map((row, i) => (
            <div key={i} className="grid gap-3 rounded-lg border border-app-border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Job title / role"><input className="app-input" value={row.title || ""} onChange={(e) => setRow("experience", i, "title", e.target.value)} /></Field>
                <Field label="Organization"><input className="app-input" value={row.organization || ""} onChange={(e) => setRow("experience", i, "organization", e.target.value)} /></Field>
                <Field label="Location"><input className="app-input" value={row.location || ""} onChange={(e) => setRow("experience", i, "location", e.target.value)} /></Field>
                <span />
                <Field label="From"><input className="app-input" type="month" value={row.from || ""} onChange={(e) => setRow("experience", i, "from", e.target.value)} /></Field>
                <Field label="To"><input className="app-input" type="month" disabled={row.current} value={row.current ? "" : row.to || ""} onChange={(e) => setRow("experience", i, "to", e.target.value)} /></Field>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(row.current)} onChange={(e) => setRow("experience", i, "current", e.target.checked)} /> I currently work here</label>
              <Field label="What did you do? (optional)"><textarea className="app-input min-h-20" value={row.description || ""} onChange={(e) => setRow("experience", i, "description", e.target.value)} /></Field>
              <button type="button" onClick={() => delRow("experience", i)} className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"><Trash2 size={15} aria-hidden="true" /> Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addRow("experience", EMPTY_EXPERIENCE)} className="inline-flex w-fit items-center gap-2 rounded-lg border border-app-border px-3 py-2 text-sm font-semibold text-app-primary hover:bg-blue-50"><Plus size={16} aria-hidden="true" /> Add experience</button>
        </Section>
      </fieldset>

      <Section step="5" title="Documents" description="Only you and the GuideShala review team can open these. Files are stored encrypted and are never shown to seekers.">
        <Field label="Type of government ID you are uploading">
          <select className="app-input" disabled={locked} value={app.govIdType || ""} onChange={(e) => setApp((a) => ({ ...a, govIdType: e.target.value }))}>
            <option value="">Select…</option>
            {GOV_ID_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        {["RESUME", "GOV_ID", "CERTIFICATE"].map((type) => (
          <DocumentSlot
            key={type}
            type={type}
            docs={docs}
            locked={locked}
            setError={setError}
            onUploaded={(d) => setDocs((list) => [...list.filter((x) => DOCUMENT_TYPES[type].multiple || x.type !== type), d])}
            onRemoved={(id) => setDocs((list) => list.filter((x) => x.id !== id))}
          />
        ))}
      </Section>

      <Panel>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1" disabled={locked} checked={Boolean(app.declaration)} onChange={(e) => setApp((a) => ({ ...a, declaration: e.target.checked }))} />
          <span>I confirm that the information and documents I have provided are true and belong to me. I understand GuideShala may verify them and may remove my profile if anything is found to be false.</span>
        </label>

        {error ? <div className="mt-4"><FormAlert>{error}</FormAlert></div> : null}
        {problems.length ? (
          <ul className="mt-3 list-disc rounded-lg border border-red-200 bg-red-50 p-3 pl-7 text-sm text-red-800">
            {problems.map((p) => <li key={p}>{p}</li>)}
          </ul>
        ) : null}
        {message ? <div className="mt-4"><FormAlert type="success">{message}</FormAlert></div> : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" disabled={locked || Boolean(busy)} onClick={() => run("save")} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-app-border bg-white px-5 py-3 text-sm font-semibold text-app-text transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
            {busy === "save" ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null} Save draft
          </button>
          <button type="button" disabled={locked || Boolean(busy)} onClick={() => run("submit")} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-r from-app-primary to-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            {busy === "submit" ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null} {status === "APPROVED" ? "Submit changes for review" : "Submit for review"}
          </button>
        </div>
      </Panel>
    </div>
  );
}
