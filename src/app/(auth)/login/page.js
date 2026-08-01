"use client";

import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicShell, Panel, SectionHeading } from "@/components";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

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

  const handleGoogleCredentialResponse = useCallback(async (response) => {
    if (!response?.credential) {
      setGoogleError("Google login failed. Please try again.");
      return;
    }

    setGoogleError("");
    setGoogleLoading(true);

    try {
      const result = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: response.credential }),
        credentials: "same-origin",
      });
      const data = await result.json();
      if (!result.ok || !data.success) {
        setGoogleError(data.message || "Unable to sign in with Google.");
        setGoogleLoading(false);
        return;
      }
      router.push("/dashboard/home");
    } catch (err) {
      setGoogleError("Unable to sign in with Google. Please try again.");
      setGoogleLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!googleClientId || !googleReady) {
      return;
    }

    if (!window.google?.accounts?.id) {
      setGoogleError("Google sign-in is unavailable right now.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredentialResponse,
      ux_mode: "popup",
    });
    window.google.accounts.id.renderButton(document.getElementById("google-signin-button"), {
      theme: "outline",
      size: "large",
      width: "100%",
      text: "continue_with",
      shape: "rectangular",
    });
  }, [googleClientId, googleReady, handleGoogleCredentialResponse]);

  return (
    <PublicShell>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGoogleReady(true)}
        onError={() => setGoogleError("Google sign-in script failed to load.")}
      />
      <section className="py-12">
        <div className="app-container grid gap-8 lg:grid-cols-[0.9fr_1fr]">
          <SectionHeading
            eyebrow="Welcome back"
            title="Continue your guidance journey"
            description="Sign in to manage bookings, save mentors, view notifications, and return to your dashboard."
          />
          <Panel>
            <div className="grid gap-4">
              {googleClientId ? (
                <div>
                  <div id="google-signin-button" className="w-full" />
                  {googleError ? <p className="mt-2 text-sm text-red-600">{googleError}</p> : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Google sign-in is available once <code className="text-app-primary">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> is configured.
                </div>
              )}
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
                New to Sahayak? <Link href="/register" className="font-semibold text-app-primary">Create account</Link>
              </p>
            </form>
          </Panel>
        </div>
      </section>
    </PublicShell>
  );
}
