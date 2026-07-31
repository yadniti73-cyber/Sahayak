import React from "react";
import { PublicHeader, PublicFooter } from "../components";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Testimonials } from "../components/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-indigo-950">
      <PublicHeader className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Sahayak</div>
          <nav className="flex gap-6 text-sm">
            <a href="#features" className="hover:underline">Booking</a>
            <a href="#testimonials" className="hover:underline">Testimonials</a>
            <a href="#signup" className="hover:underline">Find a mentor</a>
          </nav>
        </div>
      </PublicHeader>

      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />

        <section id="signup" className="py-12 bg-gray-50">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-semibold text-indigo-950">Ready to get started?</h2>
            <p className="mt-2 text-gray-600">Sign up for early access.</p>
            <form className="mt-6 flex items-center justify-center gap-2">
              <input
                aria-label="Email"
                className="rounded-md border px-4 py-2 bg-white"
                placeholder="you@domain.com"
                type="email"
              />
              <button className="rounded-md bg-indigo-900 text-white px-4 py-2">Request access</button>
            </form>
          </div>
        </section>
      </main>

      <PublicFooter className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Sahayak — Built for communities
        </div>
      </PublicFooter>
    </div>
  );
}
