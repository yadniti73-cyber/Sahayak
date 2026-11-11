"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Lock, Plus, ShieldHalf, Video, Minus } from "lucide-react";
import { Reveal } from "./Reveal";

const faqs = [
  { Icon: Video, q: "How does the session take place?", a: "All 1-on-1 calls happen securely on your browser via our in-built video room or secure link, with no apps to download." },
  { Icon: ShieldHalf, q: "What if the expert doesn't show up?", a: "We hold your payment in a secure escrow account. If they skip, you get a 100% refund." },
  { Icon: Lock, q: "Is my personal data safe?", a: "Absolutely. Your phone number and email are completely hidden. Conversations and history stay private on our platform." },
  { Icon: CalendarDays, q: "Can I reschedule my booking?", a: "Yes. Ask for a new time from your bookings page, and your guide will confirm it or suggest another slot." },
];

export function HomeFaq() {
  const router = useRouter();
  const [open, setOpen] = useState(() => new Set([0, 1, 2]));
  const [name, setName] = useState("");
  const [expertise, setExpertise] = useState("");

  function toggle(i) {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function onApply(e) {
    e.preventDefault();
    const params = new URLSearchParams({ role: "mentor" });
    if (name.trim()) params.set("name", name.trim());
    if (expertise.trim()) params.set("expertise", expertise.trim());
    router.push(`/register?${params.toString()}`);
  }

  return (
    <section id="faq" className="bg-[linear-gradient(110deg,#eaf2fd_0%,#f6faff_40%,#ffffff_100%)] py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-12">
        <Reveal>
          <h2 className="text-5xl font-bold leading-tight tracking-tight text-[#0b1736] sm:text-6xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-slate-600">Have questions? We&apos;ve got answers to help you start your journey.</p>
        </Reveal>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.55fr_1fr]">
          <div className="grid gap-5">
            {faqs.map(({ Icon, q, a }, i) => {
              const isOpen = open.has(i);
              return (
                <Reveal key={q} delay={i * 70}>
                  <div className="rounded-3xl border border-slate-300 bg-white/90 px-6 py-5 shadow-sm">
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 text-left"
                    >
                      <span className="flex items-center gap-3 text-2xl font-bold text-[#0b1736]">
                        <Icon size={28} className="shrink-0 fill-[#0b1736] text-[#0b1736]" aria-hidden="true" />
                        {q}
                      </span>
                      {isOpen ? <Minus size={26} className="shrink-0 text-[#0b1736]" aria-hidden="true" /> : <Plus size={26} className="shrink-0 text-[#0b1736]" aria-hidden="true" />}
                    </button>
                    {isOpen ? <p className="mt-4 text-xl leading-9 text-[#0b1736]">{a}</p> : null}
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={150}>
            <form
              onSubmit={onApply}
              className="rounded-3xl border border-emerald-300/80 bg-[linear-gradient(150deg,#d8f5e1_0%,#cfeeea_40%,#c3e2fe_100%)] p-7 shadow-sm sm:p-9"
            >
              <h3 className="text-4xl font-bold leading-tight text-[#0b1736]">Are you an expert in your field? Become a Guide.</h3>
              <p className="mt-4 text-xl leading-9 text-[#0b1736]">
                Join Guideshala to share your experience with those who need it most. Teach, guide, and earn on your schedule.
              </p>
              <label htmlFor="apply-name" className="mt-8 block text-xl font-medium text-[#0b1736]">Your Name</label>
              <input
                id="apply-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-lg text-[#0b1736] outline-none placeholder:text-slate-500 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              />
              <label htmlFor="apply-expertise" className="mt-6 block text-xl font-medium text-[#0b1736]">What is your expertise?</label>
              <input
                id="apply-expertise"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="'Agriculture Specialist', 'Coding Mentor'"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-lg text-[#0b1736] outline-none placeholder:text-slate-500 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              />
              <button
                type="submit"
                className="group mt-8 inline-flex min-h-[60px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#04763a] to-[#034c81] text-xl font-semibold text-white transition hover:brightness-110"
              >
                Apply as a Guide <ArrowRight size={22} className="transition group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
