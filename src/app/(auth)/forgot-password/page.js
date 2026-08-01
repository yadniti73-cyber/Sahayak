"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PublicShell, Panel, SectionHeading } from "@/components";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "same-origin",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Unable to request a password reset.");
        setLoading(false);
        return;
      }

      setMessage(result.message || "Check your email for reset instructions.");
      setLoading(false);
      setEmail("");
    } catch (err) {
      setError("Unable to request a password reset. Please try again.");
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <section className="py-12">
        <div className="app-container grid gap-8 lg:grid-cols-[0.9fr_1fr]">
          <SectionHeading
            eyebrow="Password recovery"
            title="Reset access without losing your path"
            description="Enter the email linked to your Sahayak account. The reset flow is designed to invalidate old sessions securely."
          />
          <Panel>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-semibold">
                Email
                <input
                  className="app-input"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
              <button type="submit" className="app-button w-full" disabled={loading}>
                {loading ? "Sending reset link…" : "Send reset link"}
              </button>
            </form>
          </Panel>
        </div>
      </section>
    </PublicShell>
  );
}
