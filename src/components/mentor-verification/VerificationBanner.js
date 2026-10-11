import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert, ShieldCheck } from "lucide-react";
import { STATUS_META } from "@/features/mentor-verification/constants";

const ICONS = {
  DRAFT: ShieldAlert,
  SUBMITTED: Clock,
  CHANGES_REQUESTED: AlertTriangle,
  APPROVED: ShieldCheck,
  REJECTED: AlertTriangle,
};

const TONES = {
  gray: "border-slate-200 bg-slate-50 text-slate-700",
  blue: "border-blue-100 bg-blue-50 text-blue-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  green: "border-emerald-100 bg-emerald-50 text-emerald-900",
  red: "border-red-100 bg-red-50 text-red-900",
};

/** Status strip shown to mentors. `href` adds a link to the application form. */
export function VerificationBanner({ status = "DRAFT", note = "", href }) {
  const meta = STATUS_META[status] || STATUS_META.DRAFT;
  const Icon = ICONS[status] || CheckCircle2;

  return (
    <div className={`flex flex-wrap items-start gap-3 rounded-lg border p-4 text-sm ${TONES[meta.tone]}`} role="status">
      <Icon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">Verification: {meta.label}</p>
        <p className="mt-1 leading-6">{meta.help}</p>
        {note ? (
          <p className="mt-2 rounded-md bg-white/70 p-3 leading-6">
            <span className="font-semibold">Note from our team: </span>
            {note}
          </p>
        ) : null}
      </div>
      {href && status !== "SUBMITTED" && status !== "APPROVED" ? (
        <Link href={href} className="inline-flex min-h-10 items-center rounded-lg border border-current px-4 text-sm font-semibold hover:bg-white/60">
          {status === "DRAFT" ? "Start application" : "Update application"}
        </Link>
      ) : null}
    </div>
  );
}
