import Link from "next/link";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";

export function ButtonLink({ href, children, variant = "primary", className = "" }) {
  const styles = {
    primary: "bg-app-primary text-white hover:bg-app-primaryDark border border-app-primary",
    green: "bg-green-600 text-white hover:bg-green-700 border border-green-600",
    secondary: "bg-white text-app-primary hover:bg-blue-50 border border-blue-200",
    ghost: "bg-transparent text-app-text hover:bg-slate-100 border border-transparent",
  };

  return (
    <Link
      href={href}
      className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-soft ${styles[variant]} ${className}`}
    >
      {children}
      {variant !== "ghost" ? (
        <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden="true" />
      ) : null}
    </Link>
  );
}

export function Badge({ children, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-app-primary border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    gray: "bg-slate-50 text-slate-600 border-slate-200",
    red: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Panel({ children, className = "" }) {
  return <section className={`app-card p-5 ${className}`}>{children}</section>;
}

// `highlight` is rendered in the blue-to-green gradient after `title`.
// Use as="h2" for any heading that is not the page's main title.
export function SectionHeading({ eyebrow, title, highlight, description, align = "left", as: Tag = "h1" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">{eyebrow}</p>
      ) : null}
      <Tag className="mt-3 font-display text-4xl font-semibold leading-tight text-app-text sm:text-5xl">
        {title}
        {highlight ? (
          <>
            {" "}
            <span className="bg-gradient-to-r from-app-primary to-green-600 bg-clip-text text-transparent">
              {highlight}
            </span>
          </>
        ) : null}
      </Tag>
      {description ? (
        <p className="mt-4 text-base leading-7 text-app-muted sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

export function StatCard({ label, value, detail, icon: Icon }) {
  return (
    <div className="app-card group p-5 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-app-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-app-text">{value}</p>
        </div>
        {Icon ? (
          <span className="rounded-lg bg-blue-50 p-3 text-app-primary transition group-hover:bg-green-50 group-hover:text-green-600">
            <Icon size={20} aria-hidden="true" />
          </span>
        ) : null}
      </div>
      {detail ? <p className="mt-3 text-sm text-app-muted">{detail}</p> : null}
    </div>
  );
}

export function Avatar({ initials, size = "md" }) {
  const sizes = {
    sm: "h-10 w-10 text-sm",
    md: "h-14 w-14 text-base",
    lg: "h-24 w-24 text-2xl",
  };

  return (
    <div className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-green-100 font-bold text-app-primary ring-1 ring-blue-100`}>
      {initials}
    </div>
  );
}

export function Rating({ value, reviews }) {
  return (
    <div className="flex items-center gap-1 text-sm font-semibold text-app-text">
      <Star size={16} className="fill-amber-400 text-amber-400" aria-hidden="true" />
      <span>{value}</span>
      {reviews ? <span className="font-normal text-app-muted">({reviews})</span> : null}
    </div>
  );
}

export function CheckItem({ children }) {
  return (
    <div className="flex gap-3 text-sm text-app-muted">
      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function ProgressBar({ value }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-app-primary to-green-600 transition-[width] duration-1000"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
