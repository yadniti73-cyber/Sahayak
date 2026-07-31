import React from "react";

export function Hero() {
  return (
    <section className="w-full bg-white dark:bg-black py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50">
          Sahayak — Make community help effortless
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Connect volunteers with people who need help. Manage requests, coordinate
          responses, and measure impact — all from one simple dashboard.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#signup"
            className="rounded-full bg-black text-white px-6 py-3 shadow hover:opacity-95"
          >
            Get early access
          </a>
          <a
            href="#features"
            className="rounded-full border border-zinc-200 px-6 py-3 text-zinc-700 dark:text-zinc-200"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}
