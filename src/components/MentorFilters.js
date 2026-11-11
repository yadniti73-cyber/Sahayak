"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

// Filter controls that write to the URL, so the server page re-renders with the new results.
// variant "panel": big search box + labelled selects (Find Mentors page).
// variant "bar": a single row of compact selects (category pages).
export function MentorFilters({
  basePath,
  fields,
  q = "",
  keep = {},
  variant = "panel",
  showSearch = true,
}) {
  const router = useRouter();
  const [query, setQuery] = useState(q);
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.value || ""])),
  );

  function go(nextValues, nextQuery) {
    const params = new URLSearchParams();
    const all = {
      ...keep,
      ...(showSearch ? { q: nextQuery.trim() } : {}),
      ...nextValues,
    };
    Object.entries(all).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  }

  function onChange(name, value) {
    const next = { ...values, [name]: value };
    setValues(next);
    go(next, query);
  }

  function onSubmit(e) {
    e.preventDefault();
    go(values, query);
  }

  const select = (f) => (
    <label
      key={f.name}
      className={
        variant === "panel"
          ? "grid gap-1.5 text-sm font-semibold text-[#0b1736]"
          : "block"
      }
    >
      {variant === "panel" ? (
        <span>{f.label}</span>
      ) : (
        <span className="sr-only">{f.label}</span>
      )}
      <select
        value={values[f.name]}
        onChange={(e) => onChange(f.name, e.target.value)}
        aria-label={f.label}
        className={
          variant === "bar"
            ? "w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-[15px] font-medium text-[#0b1736] shadow-sm outline-none transition hover:border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            : "w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-[#0b1736] outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        }
      >
        {f.options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );

  if (variant === "bar") {
    return (
      <form
        onSubmit={onSubmit}
        className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap"
      >
        {fields.map((f) => (
          <div
            key={f.name}
            className={`lg:min-w-[170px] ${f.align === "end" ? "lg:ml-auto" : ""}`}
          >
            {select(f)}
          </div>
        ))}
      </form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-5"
    >
      {showSearch ? (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-2 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search
            size={20}
            className="shrink-0 text-slate-500"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search mentors"
            placeholder="Search by expertise, industry, or name (e.g. 'Agri-Business', 'Mock Interview', 'CA')..."
            className="w-full bg-transparent py-2 text-[15px] text-[#0b1736] outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-[#0b1736] transition hover:bg-slate-200"
          >
            Explore <Search size={16} aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {fields.map(select)}
      </div>
    </form>
  );
}
