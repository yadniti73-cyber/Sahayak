import React from "react";

export function Hero() {
  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-950">
          Find a mentor — get the support you need
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Browse mentors, book sessions, and coordinate volunteer support. Quick
          booking flows and clear session management make community help easier.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#features"
            className="rounded-full bg-indigo-900 text-white px-6 py-3 shadow hover:opacity-95"
          >
            Find a mentor
          </a>
          <a
            href="#signup"
            className="rounded-full border border-gray-200 px-6 py-3 text-gray-700"
          >
            Request access
          </a>
        </div>
      </div>
    </section>
  );
}
