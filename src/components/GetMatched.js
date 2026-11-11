"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  MessageSquareHeart,
  ShieldCheck,
  Video,
} from "lucide-react";
import { GButton, gsButtonClass } from "./gs-ui";

// "Can't find your topic?" block. It hands the text to the contact form, which already has a backend.
export function GetMatched({ domainCount = 0 }) {
  const router = useRouter();
  const [text, setText] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams({ topic: "Support" });
    if (text.trim()) params.set("message", text.trim().slice(0, 1000));
    router.push(`/contact?${params.toString()}#contact-form`);
  }

  const pills = [
    [ShieldCheck, "100% verified experts"],
    [Video, "Direct 1-on-1 sessions"],
    [MessageSquareHeart, "Personal reply within 24 hours"],
  ];

  return (
    <div>
      <ul className="flex flex-wrap justify-center gap-3">
        {pills.map(([Icon, label]) => (
          <li
            key={label}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#0b1736] shadow-sm"
          >
            <Icon size={18} className="text-emerald-600" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>

      <form
        onSubmit={onSubmit}
        className="mx-auto mt-10 max-w-5xl rounded-3xl bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.1)] sm:p-8"
      >
        <h2 className="text-3xl font-extrabold leading-tight text-[#0b1736] sm:text-4xl">
          {"Can’t find your exact topic? Let us match you"}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          {domainCount ? `We support ${domainCount} specialized domains. ` : ""}
          Tell us what you need and our team will help match the right verified
          expert.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            rows={2}
            aria-label="Describe your topic or question"
            placeholder="Briefly describe your topic or question (e.g., goat farming subsidies, startup ESOPs)..."
            className="min-h-[56px] flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-[#0b1736] outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
          <button
            type="submit"
            className={gsButtonClass("green", "px-7 text-base")}
          >
            Get Matched <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </form>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <GButton href="/mentors" arrow>
          Browse All Mentors
        </GButton>
        <GButton href="/register?role=mentor" variant="outline">
          Join as a Guide
        </GButton>
      </div>
    </div>
  );
}
