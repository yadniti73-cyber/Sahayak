"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FolderOpen,
  MessageCircle,
  Search,
} from "lucide-react";
import { categoryIconMap } from "./category-icons";
import { GButton } from "./gs-ui";

// Main-domain groups for the filter. Slugs not listed here simply appear under "All".
const DOMAINS = [
  ["All", null],
  [
    "Career",
    [
      "career",
      "resume-interviews",
      "government-jobs",
      "competitive-exams",
      "communication-skills",
    ],
  ],
  [
    "Business",
    [
      "business",
      "personal-finance",
      "digital-marketing",
      "real-estate",
      "legal",
    ],
  ],
  ["Tech", ["technology", "design-creative"]],
  [
    "Healthcare",
    [
      "health",
      "mental-health",
      "fitness-nutrition",
      "parenting",
      "relationships",
    ],
  ],
  ["Education", ["education", "study-abroad", "competitive-exams"]],
  ["Agriculture", ["agriculture"]],
];

const QUICK = [
  ["Organic Farming", "🌾"],
  ["Resume Review", "💼"],
  ["Property Law", "⚖️"],
  ["Funding", "🚀"],
  ["Coding", "💻"],
];

// Example topics shown on each card. Categories not listed here simply show no topics.
const POPULAR_TOPICS = {
  agriculture: ["Organic Farming", "Crop disease", "Subsidies"],
  business: ["Fundraising", "Hiring", "Growth strategy"],
  career: ["Resume Review", "Mock Interview", "Career shift"],
  "communication-skills": ["Public speaking", "Spoken English", "Confidence"],
  "competitive-exams": ["JEE", "NEET", "CAT"],
  "design-creative": ["Portfolios", "Content creation", "Music"],
  "digital-marketing": ["SEO", "Social media", "Freelancing"],
  education: ["Admissions", "Scholarships", "Study planning"],
  "fitness-nutrition": ["Workout plans", "Diet", "Healthy habits"],
  "government-jobs": ["UPSC", "SSC", "Banking"],
  health: ["Second opinions", "Lifestyle", "Preventive care"],
  legal: ["Property", "Consumer rights", "Documentation"],
};

// Gradient header per category. Full class names so Tailwind can see them.
const PALETTE = [
  { bg: "from-green-600 to-green-300", text: "text-white" },
  { bg: "from-amber-600 to-yellow-300", text: "text-white" },
  { bg: "from-blue-600 to-blue-400", text: "text-white" },
  { bg: "from-purple-600 to-cyan-400", text: "text-white" },
  { bg: "from-red-500 to-orange-300", text: "text-white" },
  { bg: "from-pink-400 to-pink-200", text: "text-[#0b1736]" },
  { bg: "from-slate-700 to-slate-400", text: "text-white" },
  { bg: "from-sky-400 to-sky-100", text: "text-[#0b1736]" },
  { bg: "from-emerald-400 to-emerald-100", text: "text-[#0b1736]" },
  { bg: "from-yellow-300 to-amber-50", text: "text-[#0b1736]" },
  { bg: "from-rose-400 to-rose-100", text: "text-[#0b1736]" },
  { bg: "from-indigo-600 to-indigo-300", text: "text-white" },
];
const BY_SLUG = {
  agriculture: 0,
  business: 1,
  career: 2,
  "communication-skills": 3,
  "competitive-exams": 4,
  "design-creative": 5,
  "digital-marketing": 6,
  education: 7,
  "fitness-nutrition": 8,
  "government-jobs": 9,
  health: 10,
  legal: 6,
};

function paletteFor(slug, index) {
  if (slug in BY_SLUG) return PALETTE[BY_SLUG[slug]];
  return PALETTE[index % PALETTE.length];
}

export function CategoryExplorer({ categories = [], initialQuery = "" }) {
  const [q, setQ] = useState(initialQuery);
  const [domain, setDomain] = useState("All");

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const group = DOMAINS.find(([name]) => name === domain)?.[1];
    return categories.filter((c) => {
      if (group && !group.includes(c.slug)) return false;
      if (!needle) return true;
      return `${c.name} ${c.description}`.toLowerCase().includes(needle);
    });
  }, [categories, q, domain]);

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#0b1736] sm:text-5xl">
            Pick the area you need help with
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            {`Explore ${categories.length} specialized domains and connect with verified guides`}
          </p>
        </div>
        <div className="w-full max-w-xl">
          <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr]">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-100">
              <Search
                size={18}
                className="shrink-0 text-slate-500"
                aria-hidden="true"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search categories"
                placeholder={`Search ${categories.length} categories...`}
                className="w-full bg-transparent text-sm text-[#0b1736] outline-none placeholder:text-slate-400"
              />
            </label>
            <label className="grid rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-[#0b1736]">
                Filter by Main Domain{" "}
                <FolderOpen
                  size={15}
                  className="text-amber-500"
                  aria-hidden="true"
                />
              </span>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                aria-label="Filter by main domain"
                className="bg-transparent text-xs text-slate-500 outline-none"
              >
                {DOMAINS.map(([name]) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-500" lang="hi">
                जैसे: All, Career, Business, Tech, Healthcare
              </span>
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK.map(([label, emoji]) => (
              <button
                key={label}
                type="button"
                onClick={() => setQ(label)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-[#0b1736] transition hover:border-emerald-500 hover:text-emerald-700"
              >
                <span aria-hidden="true">{emoji}</span> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {visible.length ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((c, i) => {
            const Icon = categoryIconMap[c.icon] || BookOpen;
            const tone = paletteFor(c.slug, i);
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.14)]"
              >
                <div
                  className={`flex items-center gap-3 bg-gradient-to-r ${tone.bg} px-4 py-4 ${tone.text}`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 text-[#0b1736]">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 font-bold">
                      Explore Experts{" "}
                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </p>
                    <p className="text-sm font-medium opacity-90">
                      {c.mentorCount > 0
                        ? `${c.mentorCount.toLocaleString("en-IN")} verified ${c.mentorCount === 1 ? "mentor" : "mentors"}`
                        : "Be the first mentor"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-2xl font-extrabold text-[#0b1736]">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-[15px] leading-6 text-slate-700">
                    {c.description}
                  </p>
                  {POPULAR_TOPICS[c.slug] ? (
                    <div className="mt-auto pt-4">
                      <p className="text-sm font-bold text-[#0b1736]">
                        Popular topics
                      </p>
                      <p className="mt-0.5 text-sm text-slate-600">
                        {POPULAR_TOPICS[c.slug].join(" \u2022 ")}
                      </p>
                    </div>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-[#0b1736]">
            No categories match that search
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Try another word, or tell us what you need and we will help.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setQ("");
                setDomain("All");
              }}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-[#0b1736] hover:bg-slate-50"
            >
              Clear search
            </button>
            <GButton href="/contact?topic=Support#contact-form">
              Talk to Support
            </GButton>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-blue-200 bg-white/70 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-xl font-extrabold text-[#0b1736]">
            Can&apos;t find the exact topic you&apos;re looking for?
          </p>
          <p className="mt-1 text-base text-slate-600">
            Just let us know what you need and we will help match the right
            guide for you.
          </p>
        </div>
        <Link
          href="/contact?topic=Support#contact-form"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0b1736] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#15275a]"
        >
          Request a Custom Topic / Talk to Support{" "}
          <MessageCircle size={17} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
