"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CalendarClock, Loader2, X } from "lucide-react";
import { Badge, Panel } from "./app-primitives";
import { modeLabel, statusInfo } from "./domain-cards";

const PENDING = ["REQUESTED", "RESCHEDULE_REQUESTED"];

function BookingRow({ item, onDone }) {
  const router = useRouter();
  const [panel, setPanel] = useState(null); // "reject" | "later" | null
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [label, tone] = statusInfo(item.status);
  const pending = PENDING.includes(item.status);
  const canComplete = item.status === "CONFIRMED" && item.isPast;

  async function send(action, extra = {}) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/bookings/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action, message: message.trim() || undefined, ...extra }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.message || "Unable to update this request.");
        setBusy(false);
        return;
      }
      setPanel(null);
      setMessage("");
      setBusy(false);
      onDone(action);
      router.refresh();
    } catch {
      setError("Unable to update this request. Please try again.");
      setBusy(false);
    }
  }

  function submitLater(event) {
    event.preventDefault();
    if (!date) return send("SCHEDULE_LATER"); // no time yet: "I'll get back to you"
    const start = new Date(`${date}T${time}`);
    if (Number.isNaN(start.getTime()) || start <= new Date()) {
      setError("Please pick a time in the future.");
      return;
    }
    return send("SCHEDULE_LATER", { startAtUtc: start.toISOString() });
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-app-text">{item.seeker}</p>
          <p className="mt-1 text-sm text-app-muted">
            {item.dateLabel}, {item.timeLabel} - {item.endTimeLabel} · {modeLabel[item.mode] || item.mode}
            {item.price ? ` · ${item.price}` : ""}
          </p>
          {item.notes ? <p className="mt-2 text-sm text-app-text">"{item.notes}"</p> : null}
        </div>
        <Badge tone={tone}>{label}</Badge>
      </div>

      {pending ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => send("CONFIRM")}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
          >
            {busy && !panel ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
            Approve
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => { setPanel(panel === "later" ? null : "later"); setError(""); }}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
          >
            <CalendarClock size={16} aria-hidden="true" /> Schedule later
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => { setPanel(panel === "reject" ? null : "reject"); setError(""); }}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
          >
            <X size={16} aria-hidden="true" /> Reject
          </button>
        </div>
      ) : null}

      {canComplete ? (
        <div className="mt-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => send("COMPLETE")}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60"
          >
            <Check size={16} aria-hidden="true" /> Mark as completed
          </button>
        </div>
      ) : null}

      {panel === "reject" ? (
        <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-4">
          <label className="grid gap-1.5 text-sm font-semibold">
            Reason (optional, sent to the seeker)
            <textarea className="app-input min-h-20 resize-none" maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => send("REJECT")}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null} Reject and notify seeker
            </button>
            <button type="button" onClick={() => setPanel(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-app-muted hover:bg-slate-100">
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {panel === "later" ? (
        <form onSubmit={submitLater} className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-app-muted">
            Can't confirm this slot? Suggest another time, or leave the date empty to tell the seeker you'll schedule it later.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-semibold">
              New date (optional)
              <input className="app-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              New time
              <input className="app-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={!date} />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm font-semibold">
            Message (optional)
            <textarea className="app-input min-h-20 resize-none" maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
            >
              {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
              {date ? "Suggest this time" : "Schedule later"} and notify seeker
            </button>
            <button type="button" onClick={() => setPanel(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-app-muted hover:bg-slate-100">
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {error ? <p role="alert" className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </Panel>
  );
}

const DONE_TEXT = {
  CONFIRM: "Approved. The seeker has been notified.",
  REJECT: "Rejected. The seeker has been notified.",
  SCHEDULE_LATER: "Saved. The seeker has been notified.",
  COMPLETE: "Marked as completed.",
};

export function MentorBookingRequests({ items }) {
  const [notice, setNotice] = useState("");
  const needsAction = items.filter((i) => PENDING.includes(i.status)).sort((a, b) => a.startIso.localeCompare(b.startIso));
  const upcoming = items.filter((i) => i.status === "CONFIRMED" && !i.isPast).sort((a, b) => a.startIso.localeCompare(b.startIso));
  const rest = items
    .filter((i) => !needsAction.includes(i) && !upcoming.includes(i))
    .sort((a, b) => b.startIso.localeCompare(a.startIso));

  const groups = [
    ["Needs your response", needsAction],
    ["Upcoming sessions", upcoming],
    ["Past and closed", rest],
  ];

  return (
    <div className="grid gap-8">
      {notice ? (
        <p role="status" className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p>
      ) : null}
      {groups.map(([title, list]) =>
        list.length ? (
          <section key={title} className="grid gap-4">
            <h2 className="text-lg font-bold text-app-text">
              {title} <span className="text-sm font-semibold text-app-muted">({list.length})</span>
            </h2>
            {list.map((item) => (
              <BookingRow key={item.id} item={item} onDone={(action) => setNotice(DONE_TEXT[action] || "Updated.")} />
            ))}
          </section>
        ) : null
      )}
    </div>
  );
}
