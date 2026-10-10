"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicShell, Panel, SectionHeading } from "@/components";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";

const GOOGLE_ERROR_MESSAGES = {
  google_auth_denied: "Google sign-in was cancelled.",
  google_auth_invalid_state: "Your sign-in session expired. Please try again.",
  google_auth_failed: "Unable to sign in with Google. Please try again.",
};

function GoogleAuthError() {
  const searchParams = useSearchParams();
  const googleErrorCode = searchParams.get("error");
  const googleError = googleErrorCode
    ? GOOGLE_ERROR_MESSAGES[googleErrorCode] || "Unable to sign in with Google."
    : "";

  if (!googleError) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-600">{googleError}</p>;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "same-origin",
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.message || "Unable to sign in.");
        setLoading(false);
        return;
      }

      router.push("/dashboard/home");
    } catch (err) {
      setError("Unable to sign in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <section className="py-12">
        <div className="app-container grid gap-8 lg:grid-cols-[0.9fr_1fr]">
          <SectionHeading
            eyebrow="Welcome back"
            title="Continue your guidance journey"
            description="Sign in to manage bookings, save mentors, view notifications, and return to your dashboard."
          />
          <Panel>
            <div className="grid gap-4">
              <GoogleAuthButton />
              <Suspense fallback={null}>
                <GoogleAuthError />
              </Suspense>
            </div>
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
              <label className="grid gap-2 text-sm font-semibold">
                Password
                <input
                  className="app-input"
                  placeholder="Enter password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>
              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-app-muted">
                  <input type="checkbox" className="h-4 w-4 rounded border-app-border" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="font-semibold text-app-primary">
                  Forgot password?
                </Link>
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <button type="submit" className="app-button w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </button>
              <p className="text-center text-sm text-app-muted">
                New to GuideShala? <Link href="/register" className="font-semibold text-app-primary">Create account</Link>
              </p>
            </form>
          </Panel>
        </div>
      </section>
    </PublicShell>
  );
}