import Link from "next/link";
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  Code2,
  GraduationCap,
  HeartPulse,
  LineChart,
  MapPin,
  Scale,
  Sprout,
  Users,
  Video,
} from "lucide-react";
import { Avatar, Badge, ButtonLink, Panel, Rating } from "./app-primitives";

const iconMap = {
  Briefcase,
  GraduationCap,
  HeartPulse,
  Sprout,
  LineChart,
  Scale,
  Users,
  Code2,
  BookOpen,
};

// Database values are upper-case (REQUESTED, IN_PERSON...); mock data uses Title case.
const statusMeta = {
  REQUESTED: ["Requested", "amber"],
  CONFIRMED: ["Confirmed", "green"],
  COMPLETED: ["Completed", "blue"],
  CANCELLED: ["Cancelled", "gray"],
  REJECTED: ["Rejected", "red"],
  RESCHEDULE_REQUESTED: ["Reschedule requested", "amber"],
  NO_SHOW: ["No show", "red"],
  CLOSED: ["Closed", "gray"],
};

export function statusInfo(status) {
  const key = String(status || "").toUpperCase().replace(/\s+/g, "_");
  return statusMeta[key] || [status || "Unknown", "gray"];
}

export const modeLabel = { VIDEO: "Video", PHONE: "Phone", IN_PERSON: "In person" };

export function CategoryCard({ category }) {
  const Icon = iconMap[category.icon] || BookOpen;

  return (
    <Link href={`/category/${category.slug}`} className="app-card group block p-5 transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-center gap-4">
        <span className="rounded-lg bg-blue-50 p-3 text-app-primary transition group-hover:bg-green-50 group-hover:text-green-600">
          <Icon size={22} aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-semibold text-app-text">{category.name}</h3>
          <p className="text-sm text-app-muted">{(category.mentorCount || 0).toLocaleString()} mentors</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-app-muted">{category.description}</p>
    </Link>
  );
}

export function MentorCard({ mentor, compact = false }) {
  return (
    <article className="app-card p-5 transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex gap-4">
        <Avatar initials={mentor.initials} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/mentors/${mentor.slug}`} className="font-semibold text-app-text hover:text-app-primary">
              {mentor.name}
            </Link>
            {mentor.verified ? <Badge tone="green">Verified</Badge> : null}
          </div>
          <p className="mt-1 text-sm leading-6 text-app-muted">{mentor.headline}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-app-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin size={15} aria-hidden="true" /> {mentor.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Video size={15} aria-hidden="true" /> {modeLabel[mentor.mode] || mentor.mode}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={15} aria-hidden="true" /> {mentor.availability}
            </span>
          </div>
        </div>
      </div>
      {!compact ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-app-border pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <Rating value={mentor.rating} reviews={mentor.reviews || mentor.reviewsCount || 0} />
            <span className="text-sm text-app-muted">{mentor.experience}</span>
            <span className="text-sm font-semibold text-app-text">{mentor.price}</span>
          </div>
          <ButtonLink href={`/mentors/${mentor.slug}`} variant="secondary">
            View profile
          </ButtonLink>
        </div>
      ) : null}
    </article>
  );
}

export function BookingCard({ booking }) {
  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-app-text">{booking.topic}</p>
          <p className="mt-1 text-sm text-app-muted">{booking.mentor}</p>
          <p className="mt-3 text-sm text-app-muted">{booking.date} at {booking.time}</p>
        </div>
        <Badge tone={statusInfo(booking.status)[1]}>{statusInfo(booking.status)[0]}</Badge>
      </div>
    </Panel>
  );
}

export function SimpleTable({ headers, rows, emptyMessage = "Nothing to show yet." }) {
  return (
    <div className="app-card overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-app-muted">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-app-border">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-app-muted">{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="bg-white">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-4 text-app-muted">{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
