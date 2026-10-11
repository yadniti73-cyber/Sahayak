"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicShell, Panel } from "@/components";
import { PageHero } from "@/components/PageHero";
import { FormAlert, PasswordField, SubmitButton, isStrongPassword } from "@/components/auth-fields";

function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("A reset token is required. Please use the link sent to your email.");
      return;
    }
    if (!isStrongPassword(password)) {
      setError("Please meet all the password requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
        credentials: "same-origin",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Unable to reset password.");
        setLoading(false);
        return;
      }

      // Old sessions are revoked on reset, so send the user to sign in again.
      router.push("/login?reset=1");
    } catch (err) {
      setError("Unable to reset password. Please try again.");
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="grid gap-3">
        <FormAlert>This link is missing its reset token. Request a new one to continue.</FormAlert>
        <Link href="/forgot-password" className="text-sm font-semibold text-app-primary hover:underline">Request a new reset link</Link>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <PasswordField
        label="New password"
        placeholder="New password"
        autoComplete="new-password"
        showRules
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordField
        label="Confirm password"
        placeholder="Confirm password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {confirmPassword && password !== confirmPassword ? (
        <p className="text-xs text-red-600">Passwords do not match yet.</p>
      ) : null}
      <FormAlert>{error}</FormAlert>
      <SubmitButton loading={loading} loadingText="Updating password...">Update password</SubmitButton>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Create new password"
        title="Secure your"
        highlight="account"
        description="Use a strong password with uppercase, lowercase, a number, and a special character."
        aside={
          <Panel className="shadow-soft">
            <Suspense fallback={null}>
              <ResetForm />
            </Suspense>
          </Panel>
        }
      />
    </PublicShell>
  );
}
