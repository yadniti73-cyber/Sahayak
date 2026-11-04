"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge, Panel } from "./app-primitives";
import { modeLabel, statusInfo } from "./domain-cards";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PENDING = ["REQUESTED", "RESCHEDULE_REQUESTED"];

const pad = (n) => String(n).padStart(2, "0");
const keyOf = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

// Day colour = the most urgent thing happening that day: pending > confirmed > completed. Otherwise free (grey).
function dayKind(items) {
  if (items.some((i) => PENDING.includes(i.status))) return "pending";
  if (items.some((i) => i.status === "CONFIRMED")) return "confirmed";
  if (items.some((i) => i.status === "COMPLETED")) return "completed";
  return "free";
}

const KIND_STYLE = {
  free: "bg-slate-100 text-slate-500 hover:bg-slate-200",
  completed: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  confirmed: "bg-blue-100 text-blue-800 hover:bg-blue-200",
};
const TODAY_STYLE = "bg-rose-100 text-rose-700 ring-2 ring-rose-300 hover:bg-rose-200";

const LEGEND = [
  ["bg-slate-200", "Free"],
  ["bg-emerald-300", "Completed"],
  ["bg-amber-300", "Pending"],
  ["bg-blue-300", "Confirmed"],
  ["bg-rose-300", "Today"],
];

export function MentorCalendar({ items, todayKey }) {
  const [ty, tm] = todayKey.split("-").map(Number);
  const [year, setYear] = useState(ty);
  const [month, setMonth] = useState(tm - 1);
  const [selected, setSelected] = useState(todayKey);

  const byDay = useMemo(() => {
    const map = new Map();
    for (const item of items) {
      if (!["REQUESTED", "RESCHEDULE_REQUESTED", "CONFIRMED", "COMPLETED"].includes(item.status)) continue;
      if (!map.has(item.dayKey)) map.set(item.dayKey, []);
      map.get(item.dayKey).push(item);
    }
    return map;
  }, [items]);

  const lead = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function shift(delta) {
    const d = new Date(Date.UTC(year, month + delta, 1));
    setYear(d.getUTCFullYear());
    setMonth(d.getUTCMonth());
  }

  const selectedItems = (byDay.get(selected) || []).slice().sort((a, b) => a.startIso.localeCompare(b.startIso));
  const [sy, sm, sd] = selected.split("-").map(Number);
  const selectedLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(sy, sm - 1, sd)));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <Panel>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{MONTHS[month]} {year}</h2>
          <div className="flex gap-1">
            <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="rounded-lg border border-app-border p-2 text-app-muted hover:bg-blue-50 hover:text-app-primary">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => { setYear(ty); setMonth(tm - 1); setSelected(todayKey); }}
              className="rounded-lg border border-app-border px-3 text-sm font-semibold text-app-muted hover:bg-blue-50 hover:text-app-primary"
            >
              Today
            </button>
            <button type="button" onClick={() => shift(1)} aria-label="Next month" className="rounded-lg border border-app-border p-2 text-app-muted hover:bg-blue-50 hover:text-app-primary">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-xs font-semibold uppercase text-app-muted">
          {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {cells.map((day, i) => {
            if (!day) return <div key={`blank-${i}`} />;
            const key = keyOf(year, month, day);
            const dayItems = byDay.get(key) || [];
            const kind = dayKind(dayItems);
            const isToday = key === todayKey;
            const isSelected = key === selected;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                aria-label={`${day} ${MONTHS[month]}: ${dayItems.length ? `${dayItems.length} session${dayItems.length > 1 ? "s" : ""}` : "free"}${isToday ? ", today" : ""}`}
                aria-pressed={isSelected}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm font-semibold transition ${
                  isToday ? TODAY_STYLE : KIND_STYLE[kind]
                } ${isSelected ? "outline outline-2 outline-offset-2 outline-app-primary" : ""}`}
              >
                {day}
                {dayItems.length ? (
                  <span className="mt-0.5 text-[10px] font-bold leading-none">
                    {dayItems.length} {dayItems.length > 1 ? "sessions" : "session"}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-app-muted" aria-label="Legend">
          {LEGEND.map(([swatch, label]) => (
            <li key={label} className="inline-flex items-center gap-1.5">
              <span className={`h-3 w-3 rounded ${swatch}`} aria-hidden="true" /> {label}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <h2 className="text-lg font-bold">{selectedLabel}</h2>
        {selectedItems.length === 0 ? (
          <p className="mt-3 text-sm text-app-muted">You're free this day. No sessions or requests.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {selectedItems.map((item) => {
              const [label, tone] = statusInfo(item.status);
              return (
                <li key={item.id} className="rounded-lg border border-app-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-app-text">{item.timeLabel} - {item.endTimeLabel}</p>
                      <p className="mt-0.5 text-sm text-app-muted">{item.seeker} · {modeLabel[item.mode] || item.mode}</p>
                      {item.notes ? <p className="mt-1 text-sm text-app-text">"{item.notes}"</p> : null}
                    </div>
                    <Badge tone={tone}>{label}</Badge>
                  </div>
                  {PENDING.includes(item.status) ? (
                    <Link href="/mentor/bookings" className="mt-2 inline-block text-sm font-semibold text-app-primary hover:underline">
                      Approve, reject or reschedule
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}
