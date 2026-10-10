"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicShell, Panel, SectionHeading } from "@/components";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SEEKER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
        credentials: "same-origin",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Unable to create account.");
        setLoading(false);
        return;
      }

      router.push("/dashboard/home");
    } catch (err) {
      setError("Unable to create account. Please try again.");
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <section className="py-12">
        <div className="app-container grid gap-8 lg:grid-cols-[0.9fr_1fr]">
          <SectionHeading
            eyebrow="Create account"
            title="Join GuideShala as a seeker or mentor"
            description="Sign up to save mentors, request sessions, and manage your guidance journey."
          />
          <Panel>
            <div className="grid gap-4">
              <GoogleAuthButton />
            </div>
            <div className="my-4 flex items-center gap-3 text-xs font-semibold uppercase text-app-muted">
              <span className="h-px flex-1 bg-app-border" />
              or
              <span className="h-px flex-1 bg-app-border" />
            </div>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  First name
                  <input
                    className="app-input"
                    placeholder="First name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Last name
                  <input
                    className="app-input"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Email/Phone
                  <input
                    className="app-input"
                    type="email"
                    value={email || phone}
                    onChange={(event) => {
                      if (event.target.type === "email") {
                        setEmail(event.target.value);
                      } else {
                        setPhone(event.target.value);
                      }
                    }}
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold">
                  Password
                  <input
                    className="app-input"
                    placeholder="Create password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </label>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <button type="submit" className="app-button w-full" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </button>
              <p className="text-center text-sm text-app-muted">
                Already registered? <Link href="/login" className="font-semibold text-app-primary">Sign in</Link>
              </p>
            </form>
          </Panel>
        </div>
      </section>
    </PublicShell>
  );
}