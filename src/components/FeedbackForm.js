"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquareHeart, Send, Star } from "lucide-react";
import { Reveal } from "./Reveal";

const topics = ["General feedback", "Finding a guide", "Booking experience", "Becoming a guide", "Bug or issue", "Suggestion"];

export function FeedbackForm() {
  const [form, setForm] = useState({ name: "", email: "", topic: topics[0], message: "" });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) next.message = "Please share at least a few words (10+ characters).";
    if (!rating) next.rating = "Choose a rating.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm({ name: "", email: "", topic: topics[0], message: "" });
      setRating(0);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="feedback" className="relative overflow-hidden py-16">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 animate-float-slow rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 animate-float-slow rounded-full bg-green-200/40 blur-3xl [animation-delay:2s]" />

      <div className="app-container relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal direction="right">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-1.5 text-sm font-semibold text-app-primary shadow-sm">
            <MessageSquareHeart size={16} aria-hidden="true" />
            We&apos;d love to hear from you
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-app-text sm:text-5xl">
            Help us make guidance{" "}
            <span className="bg-gradient-to-r from-app-primary to-green-600 bg-clip-text text-transparent">
              better for everyone.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-app-muted sm:text-lg">
            Your feedback shapes how GuideShala grows. Tell us what worked, what didn&apos;t, and what you&apos;d like to see next.
          </p>
        </Reveal>

        <Reveal direction="left" delay={120}>
          <div className="app-card border-t-4 border-t-green-500 bg-white/90 p-6 shadow-soft backdrop-blur sm:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center py-10 text-center" role="status">
                <span className="animate-pop-in rounded-full bg-emerald-50 p-4 text-emerald-600">
                  <CheckCircle2 size={40} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-app-text">Thank you!</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-app-muted">
                  Your feedback has reached the team. We read every message.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm font-semibold text-app-primary hover:underline"
                >
                  Send another response
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" error={errors.name}>
                    <input className="app-input" value={form.name} onChange={update("name")} autoComplete="name" placeholder="Your name" />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input className="app-input" type="email" value={form.email} onChange={update("email")} autoComplete="email" placeholder="you@example.com" />
                  </Field>
                </div>

                <Field label="Topic">
                  <select className="app-input" value={form.topic} onChange={update("topic")}>
                    {topics.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>

                <Field label="How was your experience?" error={errors.rating}>
                  <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={rating === n}
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(n)}
                        className="rounded p-1 transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-app-primary"
                      >
                        <Star
                          size={28}
                          className={(hover || rating) >= n ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Your feedback" error={errors.message}>
                  <textarea className="app-input min-h-32 resize-y" value={form.message} onChange={update("message")} placeholder="Tell us more..." />
                </Field>

                {status === "error" ? (
                  <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    Something went wrong. Please try again in a moment.
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-app-primary to-green-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? "Sending..." : "Send feedback"}
                  <Send size={16} aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-app-text">
      {label}
      {children}
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}
