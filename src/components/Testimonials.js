import React from "react";

const TESTIMONIALS = [
  {
    name: "Maya R.",
    role: "Volunteer coordinator",
    quote:
      "Sahayak helped our team dispatch volunteers 3x faster during the last drive. The request flows are intuitive and volunteers love it.",
  },
  {
    name: "Arjun K.",
    role: "Community lead",
    quote:
      "We could finally measure our impact and see where help was needed most — that changed how we prioritized outreach.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">What people say</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.name} className="rounded-lg bg-white p-6 text-left shadow-sm dark:bg-zinc-800">
              <p className="text-zinc-700 dark:text-zinc-300">“{t.quote}”</p>
              <footer className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                — {t.name}, <span className="font-medium">{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
