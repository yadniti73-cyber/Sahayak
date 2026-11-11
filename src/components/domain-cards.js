import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Clock,
  Languages,
  MapPin,
  Sprout,
  Star,
  Video,
  Briefcase,
} from "lucide-react";
import { formatPriceOnly } from "@/lib/mentor-filters";
import { categoryIconMap } from "./category-icons";
import { Avatar, Badge, ButtonLink, Panel, Rating } from "./app-primitives";

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
  const key = String(status || "")
    .toUpperCase()
    .replace(/\s+/g, "_");
  return statusMeta[key] || [status || "Unknown", "gray"];
}

export const modeLabel = {
  VIDEO: "Video",
  PHONE: "Phone",
  IN_PERSON: "In person",
};

export function CategoryCard({ category }) {
  const Icon = categoryIconMap[category.icon] || BookOpen;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="app-card group block p-5 transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="flex items-center gap-4">
        <span className="rounded-lg bg-blue-50 p-3 text-app-primary transition group-hover:bg-green-50 group-hover:text-green-600">
          <Icon size={22} aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-semibold text-app-text">{category.name}</h3>
          <p className="text-sm text-app-muted">
            {(category.mentorCount || 0).toLocaleString()} mentors
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-app-muted">
        {category.description}
      </p>
    </Link>
  );
}

// Photo field names differ between records; take the first one that is set.
function mentorPhoto(m) {
  return m.photoUrl || m.pictureUrl || m.profilePhotoUrl || m.photo || m.image || "";
}

function experienceText(m) {
  const v = m.experience;
  if (v === undefined || v === null || v === "") return "";
  return typeof v === "number" ? `${v}+ yrs` : String(v);
}

function listText(v) {
  return Array.isArray(v) ? v.filter(Boolean).join(", ") : String(v || "");
}

function MentorPhoto({ mentor, className = "", rounded = "rounded-full" }) {
  const src = mentorPhoto(mentor);
  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 ${rounded} ${className}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={mentor.name || "Mentor"}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-app-primary">
          {mentor.initials || String(mentor.name || "").split(" ").map((w) => w[0]).join("").slice(0, 2)}
        </span>
      )}
    </div>
  );
}

// Wide card used on the Find Mentors page: photo, details, then the two actions.
function MentorRowCard({ mentor }) {
  const exp = experienceText(mentor);
  const languages = listText(mentor.languages);
  const focus = listText(mentor.specializations);
  const reviews = mentor.reviews || mentor.reviewsCount || 0;
  const sessions = mentor.sessionsCount || mentor.sessions || 0;
  const href = `/mentors/${mentor.slug}`;

  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_10px_34px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <div className="relative">
            <MentorPhoto mentor={mentor} className="h-28 w-28 ring-4 ring-white" />
            {mentor.verified ? (
              <span className="absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-2 ring-white">
                <BadgeCheck size={14} aria-hidden="true" /> Verified
              </span>
            ) : null}
          </div>
          {exp ? (
            <span className="mt-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-[#0b1736]">
              {exp} experience
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-extrabold text-[#0b1736]">
            <Link href={href} className="hover:text-emerald-700">{mentor.name}</Link>
          </h3>
          {mentor.headline ? (
            <p className="mt-1 text-base text-slate-700">{mentor.headline}</p>
          ) : null}
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[15px] text-slate-700">
            {languages ? (
              <div className="inline-flex items-center gap-2">
                <Languages size={16} className="text-slate-500" aria-hidden="true" />
                <dt className="sr-only">Speaks</dt>
                <dd>Speaks: {languages}</dd>
              </div>
            ) : null}
            {focus ? (
              <div className="inline-flex items-center gap-2">
                <Sprout size={16} className="text-emerald-600" aria-hidden="true" />
                <dt className="sr-only">Specialization</dt>
                <dd>Specialization: {focus}</dd>
              </div>
            ) : null}
            {mentor.availability ? (
              <div className="inline-flex items-center gap-2">
                <Clock size={16} className="text-slate-500" aria-hidden="true" />
                <dt className="sr-only">Next available</dt>
                <dd>Next Available: {mentor.availability}</dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] font-medium text-[#0b1736]">
            <span className="inline-flex items-center gap-1.5">
              <Star size={17} className="fill-amber-400 text-amber-400" aria-hidden="true" />
              {reviews ? Number(mentor.rating).toFixed(1) : "New"}
              <span className="font-normal text-slate-600">
                {sessions
                  ? `(${sessions}+ Sessions)`
                  : reviews
                    ? `(${reviews} reviews)`
                    : ""}
              </span>
            </span>
            {mentor.price ? (
              <>
                <span className="hidden h-5 w-px bg-slate-300 sm:block" aria-hidden="true" />
                <span>{formatPriceOnly(mentor.price)} / 30 mins session</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-row gap-3 md:w-56 md:flex-col">
          <Link
            href={href}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border-2 border-[#0b1736] bg-white px-5 py-2.5 text-sm font-semibold text-[#0b1736] transition hover:bg-slate-50"
          >
            View Profile
          </Link>
          <Link
            href={`${href}#book`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Book 30 Mins{mentor.price ? ` @ ${formatPriceOnly(mentor.price)}` : ""}
          </Link>
        </div>
      </div>
    </article>
  );
}

// Compact card used on category pages (three across).
function MentorTileCard({ mentor }) {
  const exp = experienceText(mentor);
  const reviews = mentor.reviews || mentor.reviewsCount || 0;
  const sessions = mentor.sessionsCount || mentor.sessions || 0;
  const college = mentor.college || mentor.institution || mentor.institute || "";
  const tags = Array.isArray(mentor.specializations) ? mentor.specializations.slice(0, 3) : [];
  const href = `/mentors/${mentor.slug}`;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_10px_34px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.13)]">
      <div className="flex items-end gap-3">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
          <MentorPhoto mentor={mentor} rounded="rounded-xl" className="h-full w-full" />
          {mentor.verified ? (
            <span className="absolute inset-x-0 bottom-0 inline-flex items-center gap-1 bg-emerald-700 px-2 py-1 text-xs font-semibold text-white">
              <BadgeCheck size={14} aria-hidden="true" /> Verified Check
            </span>
          ) : null}
        </div>
        {college ? (
          <span className="mb-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            {college}
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-2xl font-extrabold text-[#0b1736]">
        <Link href={href} className="hover:text-emerald-700">{mentor.name}</Link>
      </h3>
      <p className="mt-1 text-[15px] leading-6 text-slate-700">
        {mentor.headline}
        {exp ? ` \u2022 ${exp} exp` : ""}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-medium text-[#0b1736]">
        <span className="inline-flex items-center gap-1.5">
          <Star size={17} className="fill-amber-400 text-amber-400" aria-hidden="true" />
          {reviews ? Number(mentor.rating).toFixed(1) : "New"}
          {reviews ? <span className="font-normal text-slate-600">({reviews} reviews)</span> : null}
        </span>
        {sessions ? (
          <>
            <span className="h-4 w-px bg-slate-300" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5 font-normal text-slate-700">
              <Briefcase size={16} aria-hidden="true" /> {sessions}+ sessions
            </span>
          </>
        ) : null}
      </div>

      {tags.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-800">
              {t}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3 text-[15px]">
          <span className="inline-flex items-center gap-1.5 text-slate-700">
            <MapPin size={16} aria-hidden="true" /> {mentor.city || "Online"}
          </span>
          {mentor.price ? (
            <span className="font-extrabold text-[#0b1736]">{formatPriceOnly(mentor.price)} / session</span>
          ) : null}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href={href}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-[#0b1736] bg-white px-3 py-2.5 text-sm font-semibold text-[#0b1736] transition hover:bg-slate-50"
          >
            View Profile
          </Link>
          <Link
            href={`${href}#book`}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#0b1736] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15275a]"
          >
            Book Session <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function MentorCard({ mentor, compact = false, variant = "default" }) {
  if (variant === "row") return <MentorRowCard mentor={mentor} />;
  if (variant === "tile") return <MentorTileCard mentor={mentor} />;

  return (
    <article className="app-card p-5 transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex gap-4">
        <Avatar initials={mentor.initials} src={mentorPhoto(mentor) || undefined} alt={mentor.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/mentors/${mentor.slug}`}
              className="font-semibold text-app-text hover:text-app-primary"
            >
              {mentor.name}
            </Link>
            {mentor.verified ? <Badge tone="green">Verified</Badge> : null}
          </div>
          <p className="mt-1 text-sm leading-6 text-app-muted">
            {mentor.headline}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-app-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin size={15} aria-hidden="true" /> {mentor.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Video size={15} aria-hidden="true" />{" "}
              {modeLabel[mentor.mode] || mentor.mode}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={15} aria-hidden="true" />{" "}
              {mentor.availability}
            </span>
          </div>
        </div>
      </div>
      {!compact ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-app-border pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <Rating
              value={mentor.rating}
              reviews={mentor.reviews || mentor.reviewsCount || 0}
            />
            <span className="text-sm text-app-muted">{mentor.experience}</span>
            <span className="text-sm font-semibold text-app-text">
              {mentor.price}
            </span>
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
          <p className="mt-3 text-sm text-app-muted">
            {booking.date} at {booking.time}
          </p>
        </div>
        <Badge tone={statusInfo(booking.status)[1]}>
          {statusInfo(booking.status)[0]}
        </Badge>
      </div>
    </Panel>
  );
}

export function SimpleTable({
  headers,
  rows,
  emptyMessage = "Nothing to show yet.",
}) {
  return (
    <div className="app-card overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-app-muted">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-app-border">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-8 text-center text-app-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="bg-white">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-4 text-app-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
