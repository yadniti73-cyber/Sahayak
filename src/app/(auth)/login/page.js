"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicShell, CheckItem, Panel } from "@/components";
import { PageHero } from "@/components/PageHero";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { useAuth } from "@/components/providers";
import { safeNextPath } from "@/lib/safe-redirect";
import { FormAlert, OrDivider, PasswordField, SubmitButton } from "@/components/auth-fields";

const GOOGLE_ERROR_MESSAGES = {
  google_auth_denied: "Google sign-in was cancelled.",
  google_auth_invalid_state: "Your sign-in session expired. Please try again.",
  google_auth_failed: "Unable to sign in with Google. Please try again.",
};

const GOOGLE_REASON_HINTS = {
  redirect_uri_mismatch: "Google rejected the redirect address. It must exactly match an Authorised redirect URI in Google Cloud (and GOOGLE_REDIRECT_URI, if set).",
  invalid_client: "The Google client ID or client secret is wrong. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
  unauthorized_client: "This Google client is not allowed to use this sign-in flow.",
  invalid_grant: "The Google sign-in code expired or was already used. Please try again.",
  missing_credentials: "GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing on the server.",
  token_exchange_failed: "Google would not exchange the sign-in code. See the server log for details.",
  server_error: "Something failed on the server after Google sign-in. See the server log for details.",
};

function LoginNotices() {
  const searchParams = useSearchParams();
  const code = searchParams.get("error");

  if (code) {
    const hint = GOOGLE_REASON_HINTS[searchParams.get("reason")];
    return (
      <FormAlert>
        {GOOGLE_ERROR_MESSAGES[code] || "Unable to sign in with Google."}
        {hint ? ` ${hint}` : ""}
      </FormAlert>
    );
  }
  if (searchParams.get("reset") === "1") {
    return <FormAlert type="success">Password updated. Sign in with your new password.</FormAlert>;
  }
  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
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

      await refreshUser();
      const next = safeNextPath(new URLSearchParams(window.location.search).get("next"));
      router.push(next || result.data?.redirectTo || "/dashboard/home");
      router.refresh();
    } catch (err) {
      setError("Unable to sign in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <PageHero
        eyebrow="Welcome back"
        title="Continue your guidance"
        highlight="journey"
        description="Sign in to manage bookings, save mentors, view notifications, and return to your dashboard."
        aside={
          <Panel className="shadow-soft">
            <div className="grid gap-4">
              <Suspense fallback={null}>
                <LoginNotices />
              </Suspense>
              <GoogleAuthButton />
              <OrDivider />
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
                <PasswordField
                  label="Password"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <div className="text-right text-sm">
                  <Link href="/forgot-password" className="font-semibold text-app-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormAlert>{error}</FormAlert>
                <SubmitButton loading={loading} loadingText="Signing in...">Sign in</SubmitButton>
                <p className="text-center text-sm text-app-muted">
                  New to GuideShala?{" "}
                  <Link
                    href="/register"
                    onClick={(event) => {
                      const next = new URLSearchParams(window.location.search).get("next");
                      if (next) event.currentTarget.href = `/register?next=${encodeURIComponent(next)}`;
                    }}
                    className="font-semibold text-green-700 hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </form>
            </div>
          </Panel>
        }
      >
        <div className="grid max-w-md gap-3">
          <CheckItem>Manage bookings and upcoming sessions.</CheckItem>
          <CheckItem>Save mentors you want to talk to again.</CheckItem>
          <CheckItem>See notifications from your guides.</CheckItem>
        </div>
      </PageHero>
    </PublicShell>
  );
}
