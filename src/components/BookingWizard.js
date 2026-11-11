"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Loader2,
  Mail,
  Video,
} from "lucide-react";
import { formatPrice, formatPriceOnly } from "@/lib/mentor-filters";
import { useAuth } from "./providers/AuthContext";

// 4-step booking flow: choose slot -> add details -> review -> done.
// It sends the same request as before (POST /api/bookings). No payment is taken here.
const MODES = [
  ["VIDEO", "Video call"],
  ["PHONE", "Phone call"],
  ["IN_PERSON", "In person"],
];
const DURATIONS = [30, 45, 60];
const TIMES = [
  ["10:00", "10:00 AM"],
  ["14:30", "02:30 PM"],
  ["16:30", "04:30 PM"],
  ["18:00", "06:00 PM"],
  ["20:00", "08:00 PM"],
];
const STEPS = ["Choose Slot", "Tell us more", "Review", "All Set!"];

const pad = (n) => String(n).padStart(2, "0");
const toKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function nextDays(count = 7) {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d;
  });
}

function timeLabel(value) {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h)) return value;
  return `${pad(h % 12 === 0 ? 12 : h % 12)}:${pad(m || 0)} ${h >= 12 ? "PM" : "AM"}`;
}

const chip = (active, tone = "blue") =>
  `rounded-xl border px-3 py-2 text-sm font-semibold transition ${
    active
      ? tone === "green"
        ? "border-emerald-700 bg-emerald-700 text-white"
        : "border-blue-600 bg-blue-600 text-white"
      : "border-slate-200 bg-slate-50 text-[#0b1736] hover:border-slate-400"
  }`;

export function BookingWizard({
  mentorId,
  mentorSlug,
  mentorName = "this guide",
  mentorPhoto = "",
  defaultMode = "VIDEO",
  price = "",
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [days, setDays] = useState([]);
  const [step, setStep] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("16:30");
  const [mode, setMode] = useState(
    MODES.some(([v]) => v === String(defaultMode).toUpperCase())
      ? String(defaultMode).toUpperCase()
      : "VIDEO",
  );
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dates are built on the client so server and browser time zones cannot disagree.
  useEffect(() => {
    setDays(nextDays());
  }, []);

  const nextParam = encodeURIComponent(`/mentors/${mentorSlug}`);
  const isSeeker = user?.role === "SEEKER";
  const firstName = String(mentorName).split(" ")[0] || "the guide";
  const modeText = MODES.find(([v]) => v === mode)?.[1] || "Video call";
  const dateText = date
    ? new Date(`${date}T00:00`).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "";

  function validateSlot() {
    const start = new Date(`${date}T${time}`);
    if (!date || !time || Number.isNaN(start.getTime()))
      return "Please choose a date and time.";
    if (start <= new Date()) return "Please choose a time in the future.";
    return "";
  }

  function next() {
    setError("");
    if (step === 0) {
      const problem = validateSlot();
      if (problem) {
        setError(problem);
        return;
      }
    }
    setStep((s) => Math.min(2, s + 1));
  }

  async function submit() {
    setError("");
    const problem = validateSlot();
    if (problem) {
      setError(problem);
      setStep(0);
      return;
    }
    const start = new Date(`${date}T${time}`);
    const end = new Date(start.getTime() + duration * 60 * 1000);
    setLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          mentorProfileId: mentorId,
          startAtUtc: start.toISOString(),
          endAtUtc: end.toISOString(),
          mode,
          notes: notes.trim(),
          price: String(price || ""),
          seekerTimezoneAtBooking:
            Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(
          response.status === 401
            ? "Your session expired. Please sign in again."
            : result.message || "Unable to send request.",
        );
        setLoading(false);
        return;
      }
      setLoading(false);
      setStep(3);
      router.refresh();
    } catch {
      setError("Unable to send request. Please try again.");
      setLoading(false);
    }
  }

  if (!authLoading && !user) {
    return (
      <div className="mt-5 grid gap-3">
        <Link
          href={`/login?next=${nextParam}`}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b1736] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#15275a]"
        >
          Sign in to book a session
        </Link>
        <p className="text-center text-xs text-app-muted">
          New here?{" "}
          <Link
            href={`/register?next=${nextParam}`}
            className="font-semibold text-emerald-700 hover:underline"
          >
            Create a free account
          </Link>
        </p>
      </div>
    );
  }

  if (user && !isSeeker) {
    return (
      <p className="mt-5 rounded-xl bg-slate-100 p-3 text-sm text-app-muted">
        Sessions can only be booked from a seeker account.
      </p>
    );
  }

  return (
    <div className="mt-5">
      {/* Progress */}
      <div className="flex gap-1.5" aria-hidden="true">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-[#0b1736]" : "bg-slate-200"}`}
          />
        ))}
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-500">
        Step {step + 1} of {STEPS.length}
      </p>
      <h3 className="mt-1 text-2xl font-extrabold text-[#0b1736]">{`0${step + 1}. ${STEPS[step]}`}</h3>

      {step === 0 ? (
        <div className="mt-4 grid gap-4">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative shrink-0">
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 text-base font-bold text-[#0b3a5b]">
                {mentorPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mentorPhoto}
                    alt={mentorName}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  String(mentorName)
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                )}
              </span>
              <span className="absolute -bottom-1 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 ring-2 ring-white">
                <BadgeCheck size={12} aria-hidden="true" /> Verified
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-slate-600">Mentor</p>
              <p className="truncate text-lg font-extrabold text-[#0b1736]">{mentorName}</p>
              <p className="text-base text-slate-700">
                {price ? `${formatPriceOnly(price)} for ${duration} Mins` : `${duration} Mins`}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#0b1736]">
              Select date &amp; time
            </p>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {days.length === 0 ? (
                <span className="skeleton h-14 w-full" />
              ) : null}
              {days.map((d) => {
                const key = toKey(d);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDate(key)}
                    aria-pressed={date === key}
                    className={`${chip(date === key)} min-w-[64px] shrink-0 text-center leading-tight`}
                  >
                    <span className="block text-xs font-medium opacity-80">
                      {d.toLocaleDateString("en-IN", { weekday: "short" })}
                    </span>
                    <span className="block">
                      {d.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {TIMES.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTime(value)}
                aria-pressed={time === value}
                className={chip(time === value, "green")}
              >
                {label}
              </button>
            ))}
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="sr-only">Other time</span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-sm font-semibold text-[#0b1736]"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5 text-sm font-semibold text-[#0b1736]">
              Session mode
              <select
                className="app-input !rounded-xl"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                {MODES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-[#0b1736]">
              Duration
              <select
                className="app-input !rounded-xl"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                {DURATIONS.map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-4 grid gap-3">
          <label className="grid gap-2 text-sm font-semibold text-[#0b1736]">
            What would you like to discuss with {firstName}?
            <textarea
              className="app-input !rounded-xl min-h-32 resize-none font-normal"
              placeholder="e.g. I need guidance on organic farming setup and government subsidy schemes..."
              value={notes}
              maxLength={1000}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <p className="text-xs text-slate-500">
            {notes.length}/1000. A short note helps the guide prepare.
          </p>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
            <p className="text-base font-bold text-[#0b1736]">Checkout summary:</p>
            <p className="mt-1 text-[15px] text-slate-800">
              {duration}-Min Session with {mentorName} on {dateText} at {timeLabel(time)}
            </p>
            <dl className="mt-3 grid gap-2 text-slate-700">
              <div className="flex justify-between gap-3">
                <dt>Mode</dt>
                <dd className="font-semibold">{modeText}</dd>
              </div>
              <div className="flex justify-between gap-3 text-base">
                <dt>Amount:</dt>
                <dd className="font-extrabold text-[#0b1736]">{formatPrice(price)}</dd>
              </div>
            </dl>
            {notes.trim() ? (
              <p className="mt-3 line-clamp-3 border-t border-slate-200 pt-3 text-slate-600">
                {notes.trim()}
              </p>
            ) : null}
          </div>
          <p className="rounded-xl bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
            This sends a request. No payment is taken here, and the guide
            confirms before the session is booked.
          </p>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mt-4 grid gap-4 text-sm" role="status">
          <p className="flex items-center gap-2 text-2xl font-extrabold text-[#0b1736]">
            <span aria-hidden="true">🎉</span> Request sent!
            <CheckCircle2
              size={26}
              className="animate-pop-in text-emerald-600"
              aria-hidden="true"
            />
          </p>
          <p className="text-base text-slate-800">
            You asked {mentorName} for a {duration}-minute session on {dateText}{" "}
            at {timeLabel(time)}.
          </p>
          <ul className="grid gap-3 rounded-xl bg-slate-50 p-4 text-[15px] text-slate-800">
            <li className="flex items-start gap-3">
              <Video size={20} className="mt-0.5 shrink-0 text-slate-600" aria-hidden="true" />
              The guide will confirm or suggest another time.
            </li>
            <li className="flex items-start gap-3">
              <Mail size={20} className="mt-0.5 shrink-0 text-slate-600" aria-hidden="true" />
              You will be notified here, and the booking shows in your dashboard.
            </li>
          </ul>
          <Link
            href="/dashboard/bookings"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Dashboard <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      {step < 3 ? (
        <div className="mt-5 flex gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep((s) => s - 1);
              }}
              className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-[#0b1736] transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Back
            </button>
          ) : null}
          {step < 2 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {step === 0 ? "Next: Add Details" : "Continue to Review"}{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={loading || authLoading}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : null}
              {loading ? "Sending..." : "Send request"}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
