import React from "react";

const FEATURES = [
  {
    title: "Request management",
    description:
      "Quickly publish and triage help requests so volunteers can respond faster.",
  },
  {
    title: "Volunteer coordination",
    description:
      "Assign, schedule, and message volunteers — keep everyone in sync.",
  },
  {
    title: "Impact tracking",
    description:
      "Monitor outcomes and produce simple reports to understand reach and impact.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 bg-zinc-50 dark:bg-neutral-900">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Built for community organizers
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Everything needed to coordinate volunteers and route support efficiently.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">{f.title}</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
