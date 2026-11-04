"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "./providers/AuthContext";

const MODES = [
  ["VIDEO", "Video call"],
  ["PHONE", "Phone call"],
  ["IN_PERSON", "In person"],
];
const DURATIONS = [30, 45, 60];

function todayLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function RequestGuidanceForm({ mentorId, mentorSlug, defaultMode = "VIDEO", price = "" }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState(MODES.some(([v]) => v === defaultMode) ? defaultMode : "VIDEO");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const nextParam = encodeURIComponent(`/mentors/${mentorSlug}`);
  const isSeeker = user?.role === "SEEKER";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const start = new Date(`${date}T${time}`);
    if (!date || Number.isNaN(start.getTime())) {
      setError("Please choose a date and time.");
      return;
    }
    if (start <= new Date()) {
      setError("Please choose a time in the future.");
      return;
    }
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
          seekerTimezoneAtBooking: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(response.status === 401 ? "Your session expired. Please sign in again." : result.message || "Unable to send request.");
        setLoading(false);
        return;
      }
      setSent(true);
      setLoading(false);
      router.refresh();
    } catch {
      setError("Unable to send request. Please try again.");
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-5 grid gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
        <p className="flex items-center gap-2 font-semibold">
          <CheckCircle2 size={18} aria-hidden="true" /> Request sent
        </p>
        <p>The guide will confirm or suggest another time. You'll be notified here.</p>
        <Link href="/dashboard/bookings" className="font-semibold text-app-primary hover:underline">
          View my bookings
        </Link>
      </div>
    );
  }

  // Not signed in: the form is visible, but the action asks them to sign in and then brings them back here.
  if (!authLoading && !user) {
    return (
      <div className="mt-5 grid gap-3">
        <Link
          href={`/login?next=${nextParam}`}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-green-600 bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          Sign in to request guidance
        </Link>
        <p className="text-center text-xs text-app-muted">
          New here?{" "}
          <Link href={`/register?next=${nextParam}`} className="font-semibold text-green-700 hover:underline">
            Create a free account
          </Link>
        </p>
      </div>
    );
  }

  if (user && !isSeeker) {
    return (
      <p className="mt-5 rounded-lg bg-slate-100 p-3 text-sm text-app-muted">
        Guidance requests can only be sent from a seeker account.
      </p>
    );
  }

  return (
    <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
      <label className="grid gap-1.5 text-sm font-semibold">
        Session mode
        <select className="app-input" value={mode} onChange={(e) => setMode(e.target.value)}>
          {MODES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5 text-sm font-semibold">
          Date
          <input className="app-input" type="date" min={todayLocal()} value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Time
          <input className="app-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm font-semibold">
        Duration
        <select className="app-input" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
          {DURATIONS.map((m) => (
            <option key={m} value={m}>{m} minutes</option>
          ))}
        </select>
      </label>
      <textarea
        className="app-input min-h-24 resize-none"
        placeholder="Add a short note for the mentor"
        value={notes}
        maxLength={1000}
        onChange={(e) => setNotes(e.target.value)}
        aria-label="Note for the mentor"
      />
      {error ? <p role="alert" className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={loading || authLoading}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-green-600 bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
        {loading ? "Sending..." : "Request guidance"}
      </button>
      <p className="text-center text-xs text-app-muted">The guide confirms your request before the session is booked.</p>
    </form>
  );
}
