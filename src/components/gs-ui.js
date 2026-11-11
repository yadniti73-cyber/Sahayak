import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Small shared pieces for the redesigned public pages.
const variants = {
  navy: "border border-[#0b1736] bg-[#0b1736] text-white hover:bg-[#15275a]",
  outline: "border border-[#0b1736] bg-white/60 text-[#0b1736] hover:bg-white",
  green: "border border-[#0e8a5f] bg-[#0e8a5f] text-white hover:bg-[#0b744f]",
  light: "border border-slate-200 bg-white text-[#0b1736] hover:bg-slate-50",
};

export function gsButtonClass(variant = "navy", extra = "") {
  return `group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-soft disabled:translate-y-0 disabled:opacity-60 ${variants[variant] || variants.navy} ${extra}`;
}

export function GButton({
  href,
  children,
  variant = "navy",
  arrow = false,
  className = "",
  ...rest
}) {
  return (
    <Link href={href} className={gsButtonClass(variant, className)} {...rest}>
      {children}
      {arrow ? (
        <ArrowRight
          size={16}
          className="transition group-hover:translate-x-1"
          aria-hidden="true"
        />
      ) : null}
    </Link>
  );
}

const tones = {
  "blue-green": "from-blue-700 to-emerald-600",
  green: "from-emerald-700 to-emerald-500",
  teal: "from-slate-700 to-teal-700",
  navy: "from-[#0b3a5b] to-teal-700",
};

// Gradient-coloured word(s) inside a heading.
export function Hl({ children, tone = "blue-green" }) {
  return (
    <span
      className={`bg-gradient-to-r ${tones[tone] || tones["blue-green"]} bg-clip-text text-transparent`}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <p
      className={`text-sm font-bold uppercase tracking-wide text-emerald-700 ${className}`}
    >
      {children}
    </p>
  );
}

// Rounded white card used across the redesigned pages.
export function GCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.07)] ${className}`}
    >
      {children}
    </div>
  );
}
