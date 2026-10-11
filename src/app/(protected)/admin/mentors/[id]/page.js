import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { DashboardShell, Badge, Panel, SectionHeading } from "@/components";
import { AdminReviewPanel } from "@/components/mentor-verification/AdminReviewPanel";
import { DOC_TYPES, formatBytes, SESSION_MODES, STATUS_META } from "@/features/mentor-verification/constants";
import { getApplicationForAdmin } from "@/features/mentor-verification/server/service";
import { requirePageAccess } from "@/server/auth/route-guards";

export const dynamic = "force-dynamic";

const dateTime = (iso) => (iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-");
const month = (v) => (v ? new Date(`${v}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "short", year: "numeric", timeZone: "UTC" }) : "");

function Row({ label, children }) {
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-[180px_1fr]">
      <dt className="text-sm text-app-muted">{label}</dt>
      <dd className="break-words text-sm font-medium text-app-text">{children || "-"}</dd>
    </div>
  );
}

export default async function AdminMentorDetailPage({ params }) {
  await requirePageAccess(["ADMIN"]);
  const { id } = await params;

  let m;
  try {
    m = await getApplicationForAdmin(id);
  } catch (error) {
    if (error?.status === 404) notFound();
    throw error;
  }

  const meta = STATUS_META[m.status];
  const mode = SESSION_MODES.find((x) => x.value === m.profile.mode)?.label;

  return (
    <DashboardShell role="admin" title="Mentor application">
      <div className="grid gap-6">
        <Link href="/admin/mentors" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-app-primary hover:underline">
          <ArrowLeft size={16} aria-hidden="true" /> All mentors
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeading as="h1" size="sm" eyebrow="Application" title={m.personal.fullName || m.email} description={m.profile.headline} />
          <div className="flex flex-wrap gap-2">
            {m.listed ? <Badge tone="green">Live on portal</Badge> : <Badge tone="gray">Hidden from seekers</Badge>}
            <Badge tone={meta.tone}>{meta.label}</Badge>
          </div>
        </div>

        <Panel>
          <h2 className="text-lg font-bold">Decision</h2>
          {m.status === "SUBMITTED" ? <p className="mt-1 text-sm text-app-muted">Submitted {dateTime(m.review.submittedAt)}</p> : null}
          {m.review.note ? <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm"><span className="font-semibold">Last note: </span>{m.review.note}</p> : null}
          <div className="mt-4"><AdminReviewPanel profileId={m.profileId} status={m.status} /></div>
        </Panel>

        {!m.hasApplication ? (
          <Panel><p className="text-sm text-app-muted">This mentor profile was created before verification existed and has no application data. They can fill in the form from their own dashboard.</p></Panel>
        ) : null}

        <Panel>
          <h2 className="text-lg font-bold">Documents</h2>
          {m.documents.length === 0 ? (
            <p className="mt-2 text-sm text-app-muted">No documents uploaded.</p>
          ) : (
            <ul className="mt-3 grid gap-2">
              {m.documents.map((d) => (
                <li key={d.id}>
                  <a href={`/api/mentor/documents/${d.id}`} target="_blank" rel="noopener noreferrer" className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-app-border px-4 py-3 text-sm hover:border-app-primary">
                    <span className="flex min-w-0 items-center gap-3">
                      <FileText size={18} className="shrink-0 text-app-primary" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block font-semibold">{DOC_TYPES[d.type]}{d.label ? ` - ${d.label}` : ""}</span>
                        <span className="block truncate text-xs text-app-muted">{d.filename} &middot; {formatBytes(d.size)} &middot; uploaded {dateTime(d.uploadedAt)}</span>
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-app-primary">Open <ExternalLink size={14} aria-hidden="true" /></span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <h2 className="text-lg font-bold">Personal information</h2>
          <dl className="mt-2 divide-y divide-app-border">
            <Row label="Full name">{m.personal.fullName}</Row>
            <Row label="Email">{m.email}</Row>
            <Row label="Phone">{m.personal.phone}</Row>
            <Row label="Date of birth">{m.personal.dateOfBirth}</Row>
            <Row label="Gender">{m.personal.gender}</Row>
            <Row label="Address">{[m.personal.addressLine, m.personal.city, m.personal.state, m.personal.pincode].filter(Boolean).join(", ")}</Row>
            <Row label="LinkedIn">{m.personal.linkedinUrl ? <a href={m.personal.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-app-primary hover:underline">{m.personal.linkedinUrl}</a> : ""}</Row>
            <Row label="Government ID type">{m.personal.govIdType}</Row>
          </dl>
        </Panel>

        <Panel>
          <h2 className="text-lg font-bold">Public profile</h2>
          <dl className="mt-2 divide-y divide-app-border">
            <Row label="Headline">{m.profile.headline}</Row>
            <Row label="About"><span className="whitespace-pre-line font-normal">{m.profile.bio}</span></Row>
            <Row label="Category">{m.profile.category}</Row>
            <Row label="Experience">{m.profile.yearsOfExperience ? `${m.profile.yearsOfExperience} years` : ""}</Row>
            <Row label="Languages">{m.profile.languages.join(", ")}</Row>
            <Row label="Specializations">{m.profile.specializations.join(", ")}</Row>
            <Row label="Session mode">{mode}</Row>
            <Row label="Price">{m.profile.price}</Row>
            <Row label="Availability">{m.profile.availability}</Row>
          </dl>
        </Panel>

        <Panel>
          <h2 className="text-lg font-bold">Work experience</h2>
          {m.workExperience.length === 0 ? <p className="mt-2 text-sm text-app-muted">None added.</p> : (
            <ul className="mt-3 grid gap-4">
              {m.workExperience.map((w, i) => (
                <li key={i} className="rounded-lg border border-app-border p-4 text-sm">
                  <p className="font-semibold">{w.title} <span className="font-normal text-app-muted">at</span> {w.organization}</p>
                  <p className="mt-1 text-xs text-app-muted">{[month(w.startDate) + " - " + (w.current ? "Present" : month(w.endDate)), w.location].filter(Boolean).join(" · ")}</p>
                  {w.description ? <p className="mt-2 whitespace-pre-line leading-6">{w.description}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <h2 className="text-lg font-bold">Education</h2>
          {m.education.length === 0 ? <p className="mt-2 text-sm text-app-muted">None added.</p> : (
            <ul className="mt-3 grid gap-4">
              {m.education.map((e, i) => (
                <li key={i} className="rounded-lg border border-app-border p-4 text-sm">
                  <p className="font-semibold">{e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}</p>
                  <p className="mt-1">{e.institution}</p>
                  <p className="mt-1 text-xs text-app-muted">{[e.startYear && `${e.startYear} - ${e.endYear}`, !e.startYear && e.endYear, e.grade && `Grade: ${e.grade}`].filter(Boolean).join(" · ")}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {m.history.length ? (
          <Panel>
            <h2 className="text-lg font-bold">History</h2>
            <ol className="mt-3 grid gap-2 text-sm">
              {[...m.history].reverse().map((h, i) => (
                <li key={i} className="flex flex-wrap gap-x-3 text-app-muted">
                  <span className="w-44 shrink-0">{dateTime(h.at)}</span>
                  <span className="font-semibold text-app-text">{h.action.replace(/_/g, " ")}</span>
                  {h.note ? <span>- {h.note}</span> : null}
                </li>
              ))}
            </ol>
          </Panel>
        ) : null}
      </div>
    </DashboardShell>
  );
}
