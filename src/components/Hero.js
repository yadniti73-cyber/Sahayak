import { BadgeCheck } from "lucide-react";
import { platformStats } from "@/lib/frontend-data";
import { ButtonLink } from "./app-primitives";
import { GuideTree } from "./GuideTree";
import { RotatingWords } from "./RotatingWords";
import { Reveal } from "./Reveal";
import { HeroIconBackdrop } from "./HeroIconBackdrop";

const heroWords = ["lives", "careers", "farms", "businesses", "futures"];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-app-border bg-gradient-to-br from-white via-blue-50/60 to-green-50/50">
      <HeroIconBackdrop />
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl float-slow" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-green-200/40 blur-3xl float-slow" />

      <div className="app-container relative grid items-center gap-12 py-12 lg:grid-cols-[1fr_1fr] lg:py-20">
        <div className="flex flex-col justify-center">
          <Reveal>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-app-border bg-white px-4 py-1.5 text-sm font-semibold text-app-primary shadow-sm">
              <BadgeCheck size={16} aria-hidden="true" />
              Trusted mentorship for real decisions
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-tight text-app-text sm:text-6xl">
              Guidance changes <RotatingWords words={heroWords} />.
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-5 max-w-xl text-lg leading-8 text-app-muted">
              Whether you are a student, farmer, entrepreneur, parent, artist, or
              professional, find someone who understands your journey.
            </p>
          </Reveal>

          <Reveal delay={300} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/register" className="px-7 text-lg shadow-soft">
              Contact a Guide
            </ButtonLink>
            <ButtonLink href="/register" variant="green" className="px-7 text-lg">
              Join as Guide
            </ButtonLink>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-app-border pt-6 sm:grid-cols-4">
            {platformStats.map((stat, i) => (
              <Reveal key={stat.label} delay={400 + i * 80}>
                <p className="text-2xl font-bold text-app-text">{stat.value}</p>
                <p className="text-sm text-app-muted">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={200} className="flex items-center justify-center">
          <GuideTree />
        </Reveal>
      </div>
    </section>
  );
}
