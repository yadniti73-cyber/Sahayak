import React from "react";
import { PublicHeader, PublicFooter } from "../components";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Testimonials } from "../components/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-50">
      <PublicHeader className="border-b bg-white dark:bg-black">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Sahayak</div>
          <nav className="flex gap-6 text-sm">
            <a href="#features" className="hover:underline">Features</a>
            <a href="#testimonials" className="hover:underline">Testimonials</a>
            <a href="#signup" className="hover:underline">Sign up</a>
          </nav>
        </div>
      </PublicHeader>

      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />

        <section id="signup" className="py-12 bg-zinc-50 dark:bg-neutral-900">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-semibold">Ready to get started?</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Sign up for early access.</p>
            <form className="mt-6 flex items-center justify-center gap-2">
              <input
                aria-label="Email"
                className="rounded-md border px-4 py-2 bg-white dark:bg-zinc-800"
                placeholder="you@domain.com"
                type="email"
              />
              <button className="rounded-md bg-black text-white px-4 py-2">Request access</button>
            </form>
          </div>
        </section>
      </main>

      <PublicFooter className="border-t bg-white dark:bg-black">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} Sahayak — Built for communities
        </div>
      </PublicFooter>
    </div>
  );
}
