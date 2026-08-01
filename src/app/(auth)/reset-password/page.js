"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PublicShell, Panel, SectionHeading } from "@/components";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("A reset token is required. Please use the link sent to your email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
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

      router.push("/dashboard/home");
    } catch (err) {
      setError("Unable to reset password. Please try again.");
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <section className="py-12">
        <div className="app-container grid gap-8 lg:grid-cols-[0.9fr_1fr]">
          <SectionHeading
            eyebrow="Create new password"
            title="Secure your account"
            description="Use a strong password with uppercase, lowercase, a number, and a special character."
          />
          <Panel>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-semibold">
                New password
                <input
                  className="app-input"
                  placeholder="New password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Confirm password
                <input
                  className="app-input"
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </label>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <button type="submit" className="app-button w-full" disabled={loading}>
                {loading ? "Updating password…" : "Update password"}
              </button>
            </form>
          </Panel>
        </div>
      </section>
    </PublicShell>
  );
}
