import { CalendarCheck, ShieldCheck, Users } from "lucide-react";
import { platformStats } from "@/lib/frontend-data";
import { ButtonLink } from "./app-primitives";

export function Hero() {
  return (
    <section className="border-b border-app-border bg-white">
      <div className="app-container grid gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-app-primary">
            Trusted mentorship for real decisions
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight text-app-text sm:text-6xl">
            Guidance changes lives.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-app-muted">
            Whether you are a student, farmer, entrepreneur, parent, artist, or professional, find someone who understands your journey.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/mentors">Find a mentor</ButtonLink>
            <ButtonLink href="/register" variant="secondary">Become a mentor</ButtonLink>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            {platformStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-app-text">{stat.value}</p>
                <p className="text-sm text-app-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="app-card overflow-hidden p-5">
            <div className="rounded-lg bg-gradient-to-br from-blue-700 to-sky-600 p-6 text-white">
              <p className="text-sm opacity-90">Session board</p>
              <h2 className="mt-3 text-3xl font-bold">3 people are ready to help this week</h2>
              <div className="mt-8 grid gap-3">
                {[
                  ["Career call", "Today, 6:00 PM"],
                  ["Crop diagnosis", "Tomorrow, 8:30 AM"],
                  ["Parenting support", "Friday, 5:00 PM"],
                ].map(([title, time]) => (
                  <div key={title} className="rounded-lg bg-white/15 p-4 backdrop-blur">
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm opacity-85">{time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              [ShieldCheck, "Verified experts"],
              [CalendarCheck, "Simple booking"],
              [Users, "Human guidance"],
            ].map(([Icon, label]) => (
              <div key={label} className="app-card flex items-center gap-3 p-4">
                <Icon size={20} className="text-app-primary" aria-hidden="true" />
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
