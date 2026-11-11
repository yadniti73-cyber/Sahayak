"use client";

import { useState } from "react";
import { CheckCircle2, Zap } from "lucide-react";

const topics = ["Mentor verification", "Support", "Partnership"];

export function ContactForm({ initialTopic = "", initialMessage = "" }) {
  const startTopic = topics.includes(initialTopic) ? initialTopic : topics[0];
  const [form, setForm] = useState({ name: "", email: "", topic: startTopic, message: initialMessage });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
      setForm({ name: "", email: "", topic: startTopic, message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {status === "done" ? (
        <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          Thanks, your message was sent. We will reply with next steps.
        </div>
      ) : null}

      <label className="grid gap-1 text-sm font-semibold text-app-text">
        Full name
        <input required className="app-input !rounded-xl" value={form.name} onChange={update("name")} autoComplete="name" />
      </label>
      <label className="grid gap-1 text-sm font-semibold text-app-text">
        Email
        <input required type="email" className="app-input !rounded-xl" value={form.email} onChange={update("email")} autoComplete="email" />
      </label>
      <label className="grid gap-1 text-sm font-semibold text-app-text">
        Topic
        <select className="app-input !rounded-xl" value={form.topic} onChange={update("topic")}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold text-app-text">
        How can we help?
        <textarea
          required
          maxLength={1000}
          className="app-input !rounded-xl min-h-40 resize-none"
          value={form.message}
          onChange={update("message")}
        />
      </label>

      {status === "error" ? (
        <p className="text-sm text-red-700" role="alert">Could not send. Please try again.</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-700 bg-emerald-700 px-6 py-3.5 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-soft disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send message"}
        <Zap size={16} className="transition group-hover:translate-x-1" aria-hidden="true" />
      </button>
    </form>
  );
}
