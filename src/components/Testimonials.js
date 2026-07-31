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
    <section id="testimonials" className="py-16 bg-white">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-2xl font-semibold text-indigo-950">What people say</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.name} className="rounded-lg bg-gray-50 p-6 text-left shadow-sm">
              <p className="text-gray-700">“{t.quote}”</p>
              <footer className="mt-4 text-sm text-gray-600">
                — {t.name}, <span className="font-medium">{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
