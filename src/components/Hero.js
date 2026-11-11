"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Banknote, BadgeCheck, CheckCircle2, Globe, LockKeyhole, Search, ShieldCheck, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { HeroIconBackdrop } from "./HeroIconBackdrop";

// Sample profiles shown in the hero. Swap for real featured mentors when ready.
const heroMentors = [
  {
    name: "Dr. Amit Patel",
    rating: "4.9",
    role: "Agri-Business Expert",
    languages: "Hindi & Gujarati",
    cta: "Book 30 Mins • ₹499",
    photo: "/images/hero/amit-patel.jpg",
    nameBadge: true,
    roleBadge: true,
    className: "lg:mr-10",
  },
  {
    name: "Ananya Sharma",
    rating: "5.0",
    role: "Senior Software Engineer",
    tag: "Tech & Career",
    languages: "English & Hindi",
    cta: "Book 30 Mins • ₹499",
    photo: "/images/hero/ananya-sharma.jpg",
    className: "lg:ml-10",
  },
];

const chips = [
  { label: "Agriculture", href: "/category/agriculture" },
  { label: "Technology", href: "/category/technology" },
  { label: "Career & Jobs", href: "/category/career" },
  { label: "Business & Law", href: "/category/business" },
];

const assurances = [
  { Icon: ShieldCheck, label: "100% KYC Verified Mentors", cls: "text-[#1366c4]" },
  { Icon: LockKeyhole, label: "Secure booking", cls: "text-amber-500" },
  { Icon: Globe, label: "Nationwide access", cls: "text-[#1366c4]" },
  { Icon: Banknote, label: "Secure Escrow Guarantee", cls: "text-emerald-600" },
];

function MentorCard({ m }) {
  return (
    <div className={`flex gap-5 rounded-2xl border border-white bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:p-5 ${m.className || ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={m.photo}
        alt={m.name}
        width={170}
        height={190}
        className="h-[170px] w-[140px] shrink-0 rounded-xl object-cover sm:h-[190px] sm:w-[165px]"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="flex items-center gap-1.5 text-xl font-bold leading-tight text-[#0b1736]">
            {m.name}
            {m.nameBadge ? <BadgeCheck size={20} className="shrink-0 fill-[#1366c4] text-white" aria-label="Verified" /> : null}
          </p>
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#0b1736]">
            <Star size={16} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            {m.rating}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-[15px] text-slate-700">
          {m.role}
          {m.roleBadge ? <CheckCircle2 size={18} className="fill-emerald-500 text-white" aria-label="Verified" /> : null}
        </p>
        {m.tag ? (
          <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[15px] text-[#0b1736]">
            {m.tag}
            <CheckCircle2 size={18} className="fill-emerald-500 text-white" aria-label="Verified" />
          </p>
        ) : null}
        <p className="mt-2 flex items-center gap-2 text-[15px] text-[#0b1736]">
          <Globe size={18} className="text-slate-500" aria-hidden="true" />
          {m.languages}
        </p>
        <Link
          href="/mentors"
          className="mt-auto inline-flex min-h-[46px] items-center justify-center rounded-lg bg-[#1366c4] px-4 text-[16px] font-semibold text-white transition hover:bg-[#0e52a0]"
        >
          {m.cta}
        </Link>
      </div>
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSearch(e) {
    e.preventDefault();
    const v = q.trim();
    router.push(v ? `/mentors?q=${encodeURIComponent(v)}` : "/mentors");
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200/60 bg-[linear-gradient(100deg,#ffffff_0%,#f5f8ff_45%,#d6e8fe_100%)]">
      <HeroIconBackdrop />
      <div className="pointer-events-none absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-blue-300/30 blur-3xl float-slow" />

      <div className="relative mx-auto grid w-full max-w-[1500px] items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-24">
        <div>
          <Reveal>
            <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.1] text-[#0b1736] sm:text-6xl xl:text-[4.25rem]">
              Guidance That Shapes Your Future
            </h1>
          </Reveal>

          <Reveal delay={100}>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-[#0b1736]">
              Whether you are a student, farmer, entrepreneur, parent, artist, or professional, find someone who understands your journey.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <form
              onSubmit={onSearch}
              className="mt-8 flex max-w-3xl items-center rounded-xl border border-slate-300 bg-white px-5 py-4 shadow-sm transition focus-within:border-[#1366c4] focus-within:ring-4 focus-within:ring-blue-100"
            >
              <Search size={24} className="shrink-0 text-slate-500" aria-hidden="true" />
              <input
                aria-label="Search mentors by topic"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={'Search: "Daily Farming", "Coding Mock Interview", "Startup Legal"...'}
                className="w-full bg-transparent px-4 text-lg text-[#0b1736] outline-none placeholder:text-slate-500"
              />
            </form>
            <div className="mt-4 flex flex-wrap gap-3">
              {chips.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  className="rounded-full border border-slate-300/80 bg-[#e8eaee] px-5 py-2 text-[17px] text-[#0b1736] transition hover:border-[#1366c4] hover:bg-white hover:text-[#1366c4]"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={300} className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/mentors"
              className="group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-[#0b3f87] px-8 text-xl font-medium text-white shadow-[0_10px_24px_rgba(11,63,135,0.25)] transition hover:-translate-y-0.5 hover:bg-[#0a3573]"
            >
              Find an Expert <ArrowRight size={20} className="transition group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="/register?role=mentor"
              className="group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-[#229e56] px-8 text-xl font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#1b8548]"
            >
              Join as Guide <ArrowRight size={20} className="transition group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>

          <Reveal delay={400}>
            <ul className="mt-8 flex max-w-3xl flex-wrap gap-x-8 gap-y-3 border-t border-slate-300/70 pt-6">
              {assurances.map(({ Icon, label, cls }) => (
                <li key={label} className="flex items-center gap-2.5 text-lg text-[#0b1736]">
                  <Icon size={24} className={cls} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={200} className="grid gap-6">
          {heroMentors.map((m) => (
            <MentorCard key={m.name} m={m} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
