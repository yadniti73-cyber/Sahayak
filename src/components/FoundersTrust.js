import Link from "next/link";
import {
  ArrowRight, Banknote, CalendarClock, Clock, Handshake, Heart, LockKeyhole, ShieldCheck, SquarePen,
} from "lucide-react";
import { Reveal } from "./Reveal";

const promises = [
  { icons: [ShieldCheck], tile: "bg-[#d6e6ff] text-[#1366c4]", title: "Every Guide is Checked", text: "We verify identity & experience before a guide is listed. No anonymous profiles." },
  { icons: [Banknote, Heart], tile: "bg-[#cbeddd] text-[#0f7a3d]", title: "Risk-Free Session", text: "If your first call isn't useful, tell us and we'll make it right or rematch you." },
  { icons: [Clock], tile: "bg-[#e4e4ec] text-[#0b1736]", title: "We reply within 24 Hours", text: "A real person from the founding team answers every message while we are small." },
  { icons: [LockKeyhole], tile: "bg-[#f6e6c3] text-[#a16207]", title: "Your Details Stay Private", text: "We never sell your data. You decide what a guide can see." },
];

const steps = [
  { Icon: SquarePen, ring: "from-[#5b9be0] to-[#1d5fb8]", title: "Step 1: Tell us your situation", text: "Career, farming, studies, health, or business. Say it in your own words." },
  { Icon: Handshake, ring: "from-[#5fcf9b] to-[#12814f]", title: "Step 2: Meet a matched guide", text: "We suggest guides who have actually walked a similar path." },
  { Icon: CalendarClock, ring: "from-[#dcc27a] to-[#a8842a]", title: "Step 3: Book and talk", text: "Pick a time, talk via secure video/call, and get a clear action plan." },
];

function DashedArrow() {
  return (
    <svg viewBox="0 0 56 12" className="hidden h-3 w-14 shrink-0 text-slate-400 lg:block" aria-hidden="true">
      <path d="M1 6h48" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" fill="none" />
      <path d="M45 1l8 5-8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function FoundersTrust() {
  return (
    <section id="trust" className="bg-[linear-gradient(110deg,#ffffff_0%,#f3f8ff_55%,#d9e9fd_100%)] py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-12">
        <Reveal>
          <h2 className="text-5xl font-bold leading-tight tracking-tight text-[#0b1736] sm:text-6xl">Why Trust Us</h2>
          <p className="mt-4 text-3xl font-bold text-[#0b1736] sm:text-4xl">Built by IITians, run with accountability.</p>
          <p className="mt-4 max-w-4xl text-xl leading-9 text-[#0b1736]">
            We are not claiming big numbers yet. We are promising care, honesty and a real person behind every conversation.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {promises.map(({ icons, tile, title, text }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1">
                <div className="flex gap-1">
                  {icons.map((Icon, k) => (
                    <span key={k} className={`flex h-14 w-14 items-center justify-center rounded-xl ${tile}`}>
                      <Icon size={28} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                  ))}
                </div>
                <h3 className="mt-8 text-2xl font-bold leading-tight text-[#0b1736]">{title}</h3>
                <p className="mt-3 text-lg leading-8 text-[#0b1736]">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <h2 className="text-4xl font-bold tracking-tight text-[#0b1736] sm:text-5xl">How it Works</h2>
        </Reveal>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
          {steps.map(({ Icon, ring, title, text }, i) => (
            <div key={title} className="flex items-start gap-4 lg:contents">
              <Reveal delay={i * 120} className="flex flex-1 items-start gap-5">
                <span className={`flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${ring} shadow-[0_14px_30px_rgba(15,23,42,0.18)]`}>
                  <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-white/85">
                    <Icon size={44} strokeWidth={1.6} className="text-[#2b4a7a]" aria-hidden="true" />
                  </span>
                </span>
                <div>
                  <h3 className="text-2xl font-bold leading-tight text-[#0b1736]">{title}</h3>
                  <p className="mt-2 text-xl leading-8 text-[#0b1736]">{text}</p>
                </div>
              </Reveal>
              {i < steps.length - 1 ? <div className="hidden lg:flex lg:h-[120px] lg:items-center"><DashedArrow /></div> : null}
            </div>
          ))}
        </div>

        <Reveal className="mt-14 flex justify-center">
          <Link
            href="/mentors"
            className="group inline-flex min-h-[64px] items-center gap-3 rounded-xl bg-[#1366c4] px-10 text-2xl font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0e52a0]"
          >
            Book Your First Risk-Free Call <ArrowRight size={24} className="transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
