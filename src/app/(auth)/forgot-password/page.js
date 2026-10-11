"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { PublicShell, CheckItem, Panel } from "@/components";
import { PageHero } from "@/components/PageHero";
import { FormAlert, SubmitButton } from "@/components/auth-fields";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
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
    } catch (err) {
      setError("Unable to request a password reset. Please try again.");
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <PageHero
        eyebrow="Password recovery"
        title="Reset access without losing your"
        highlight="path"
        description="Enter the email linked to your GuideShala account. The reset flow is designed to invalidate old sessions securely."
        aside={
          <Panel className="shadow-soft">
            {message ? (
              <div className="grid justify-items-center gap-3 py-4 text-center">
                <span className="rounded-full bg-emerald-50 p-4 text-emerald-700">
                  <MailCheck size={28} aria-hidden="true" />
                </span>
                <h2 className="text-lg font-bold">Check your inbox</h2>
                <p className="text-sm text-app-muted" role="status">{message}</p>
                <Link href="/login" className="text-sm font-semibold text-app-primary hover:underline">Back to sign in</Link>
              </div>
            ) : (
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2 text-sm font-semibold text-app-text">
                  Email
                  <input
                    className="app-input"
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
                <FormAlert>{error}</FormAlert>
                <SubmitButton loading={loading} loadingText="Sending reset link...">Send reset link</SubmitButton>
                <p className="text-center text-sm text-app-muted">
                  Remembered it?{" "}
                  <Link href="/login" className="font-semibold text-green-700 hover:underline">Sign in</Link>
                </p>
              </form>
            )}
          </Panel>
        }
      >
        <div className="grid max-w-md gap-3">
          <CheckItem>We email a one-time link to your address.</CheckItem>
          <CheckItem>The link expires, and each link works once.</CheckItem>
          <CheckItem>Signing in again is required after a reset.</CheckItem>
        </div>
      </PageHero>
    </PublicShell>
  );
}
