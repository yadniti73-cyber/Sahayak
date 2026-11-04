"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Pencil } from "lucide-react";
import { Avatar, Badge, Panel } from "@/components/app-primitives";
import { ProfilePhotoUploader } from "@/components/ProfilePhotoUploader";
import { getInitials, useAuth } from "@/components/providers";
import { VerificationBanner } from "@/components/mentor-verification/VerificationBanner";
import { MentorApplicationForm } from "@/components/mentor-verification/MentorApplicationForm";
import { DOC_TYPES, formatBytes, STATUS_META } from "@/features/mentor-verification/constants";
import { modeLabel } from "@/components/domain-cards";

function Item({ label, children, wide = false }) {
  const empty = children === undefined || children === null || children === "" || (Array.isArray(children) && children.length === 0);
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-app-muted">{label}</dt>
      <dd className="mt-1 whitespace-pre-line text-sm text-app-text">{empty ? <span className="text-app-muted">Not added yet</span> : children}</dd>
    </div>
  );
}

function monthYear(value) {
  if (!value) return "";
  const d = new Date(`${value.length === 7 ? `${value}-01` : value}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric", timeZone: "UTC" }).format(d);
}

function ProfileView({ app, onEdit }) {
  const { user } = useAuth();
  const { profile, personal } = app;
  const name = personal.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Your name";
  const statusLabel = (STATUS_META[app.status] || STATUS_META.DRAFT).label;

  return (
    <div className="grid gap-6">
      <VerificationBanner status={app.status} note={app.review?.note} />

      <Panel>
        <div className="grid gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar initials={getInitials(user?.firstName, user?.lastName)} src={user?.pictureUrl} alt={name} size="lg" />
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-app-text">{name}</h2>
                {profile.headline ? <p className="text-sm text-app-muted">{profile.headline}</p> : null}
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.category ? <Badge>{profile.category}</Badge> : null}
                  <Badge tone={app.status === "APPROVED" ? "green" : "amber"}>{statusLabel}</Badge>
                </div>
              </div>
            </div>
            {app.editable ? (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-app-primary transition hover:bg-blue-50"
              >
                <Pencil size={16} aria-hidden="true" /> Edit profile
              </button>
            ) : (
              <p className="max-w-xs text-sm text-app-muted">Your application is under review, so it can't be edited right now.</p>
            )}
          </div>

          <dl className="grid gap-5 sm:grid-cols-2">
            <Item label="Email">{app.email}</Item>
            <Item label="City">{personal.city}</Item>
            <Item label="Session mode">{modeLabel[profile.mode] || profile.mode}</Item>
            <Item label="Price per session">{profile.price}</Item>
            <Item label="Experience">{profile.yearsOfExperience ? `${profile.yearsOfExperience} years` : ""}</Item>
            <Item label="Availability">{profile.availability}</Item>
            <Item label="Languages">{profile.languages.join(", ")}</Item>
            <Item label="Specializations">{profile.specializations.join(", ")}</Item>
            <Item label="About" wide>{profile.bio}</Item>
          </dl>

          <section>
            <h3 className="text-sm font-bold text-app-text">Work experience</h3>
            {app.workExperience.length === 0 ? (
              <p className="mt-2 text-sm text-app-muted">Not added yet</p>
            ) : (
              <ul className="mt-3 grid gap-3">
                {app.workExperience.map((w, i) => (
                  <li key={i} className="rounded-lg border border-app-border p-3 text-sm">
                    <p className="font-semibold text-app-text">{w.title}{w.organization ? ` · ${w.organization}` : ""}</p>
                    <p className="text-app-muted">
                      {[monthYear(w.startDate), w.current ? "Present" : monthYear(w.endDate)].filter(Boolean).join(" - ")}
                      {w.location ? ` · ${w.location}` : ""}
                    </p>
                    {w.description ? <p className="mt-1 whitespace-pre-line text-app-text">{w.description}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="text-sm font-bold text-app-text">Education</h3>
            {app.education.length === 0 ? (
              <p className="mt-2 text-sm text-app-muted">Not added yet</p>
            ) : (
              <ul className="mt-3 grid gap-3">
                {app.education.map((e, i) => (
                  <li key={i} className="rounded-lg border border-app-border p-3 text-sm">
                    <p className="font-semibold text-app-text">{e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}</p>
                    <p className="text-app-muted">
                      {e.institution}
                      {e.startYear || e.endYear ? ` · ${[e.startYear, e.endYear].filter(Boolean).join(" - ")}` : ""}
                      {e.grade ? ` · ${e.grade}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="text-sm font-bold text-app-text">Documents</h3>
            {app.documents.length === 0 ? (
              <p className="mt-2 text-sm text-app-muted">No documents uploaded yet</p>
            ) : (
              <ul className="mt-3 grid gap-2">
                {app.documents.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm">
                    <FileText size={16} className="shrink-0 text-app-primary" aria-hidden="true" />
                    <span className="text-app-muted">{DOC_TYPES[d.type] || d.type}:</span>
                    <a href={`/api/mentor/documents/${d.id}`} target="_blank" rel="noopener noreferrer" className="truncate font-medium text-app-primary hover:underline">
                      {d.label ? `${d.label} - ` : ""}{d.filename}
                    </a>
                    <span className="text-xs text-app-muted">{formatBytes(d.size)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {app.listed && app.slug ? (
            <Link href={`/mentors/${app.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-app-primary hover:underline">
              <ExternalLink size={16} aria-hidden="true" /> See how seekers view your public profile
            </Link>
          ) : null}
        </div>
      </Panel>
    </div>
  );
}

export function MentorProfileSection({ initial, categories }) {
  // A mentor who hasn't filled anything in yet goes straight to the form.
  const isNew = !initial.profile.headline && !initial.profile.bio && initial.workExperience.length === 0 && initial.education.length === 0;
  const [editing, setEditing] = useState(isNew && initial.editable);

  if (!editing) return <ProfileView app={initial} onEdit={() => setEditing(true)} />;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Go back to your profile? Any section you haven't saved will be lost.")) setEditing(false);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-muted transition hover:bg-slate-50"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to profile
        </button>
      </div>
      <Panel>
        <ProfilePhotoUploader />
      </Panel>
      <MentorApplicationForm initial={initial} categories={categories} />
    </div>
  );
}
