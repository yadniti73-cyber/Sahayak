"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Search } from "lucide-react";
import { PublicShell, CheckItem, Panel } from "@/components";
import { PageHero } from "@/components/PageHero";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { FormAlert, OrDivider, PasswordField, SubmitButton, isStrongPassword } from "@/components/auth-fields";

const roles = [
  { value: "SEEKER", icon: Search, title: "I need guidance", text: "Find and book a guide" },
  { value: "MENTOR", icon: GraduationCap, title: "I want to guide", text: "Share what you know" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(searchParams.get("role")?.toLowerCase() === "mentor" ? "MENTOR" : "SEEKER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!isStrongPassword(password)) {
      setError("Please meet all the password requirements.");
      return;
    }

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
      router.refresh();
    } catch (err) {
      setError("Unable to create account. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <GoogleAuthButton />
      <OrDivider />
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <fieldset className="grid gap-2">
          <legend className="text-sm font-semibold text-app-text">I am joining as</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {roles.map(({ value, icon: Icon, title, text }) => {
              const active = role === value;
              return (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition hover:-translate-y-0.5 ${
                    active ? "border-green-500 bg-green-50 shadow-sm" : "border-app-border bg-white hover:border-blue-200"
                  }`}
                >
                  <input type="radio" name="role" value={value} checked={active} onChange={() => setRole(value)} className="sr-only" />
                  <span className={`rounded-lg p-2 ${active ? "bg-green-100 text-green-700" : "bg-blue-50 text-app-primary"}`}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-app-text">{title}</span>
                    <span className="block text-xs text-app-muted">{text}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-app-text">
            First name
            <input className="app-input" placeholder="First name" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-app-text">
            Last name
            <input className="app-input" placeholder="Last name" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-app-text">
          Email
          <input className="app-input" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <PasswordField
          label="Password"
          placeholder="Create password"
          autoComplete="new-password"
          showRules
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <FormAlert>{error}</FormAlert>
        <SubmitButton loading={loading} loadingText="Creating account...">Create account</SubmitButton>
        <p className="text-center text-sm text-app-muted">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-green-700 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Create account"
        title="Join GuideShala as a seeker or"
        highlight="mentor"
        description="Sign up to save mentors, request sessions, and manage your guidance journey."
        aside={
          <Panel className="shadow-soft">
            <Suspense fallback={null}>
              <RegisterForm />
            </Suspense>
          </Panel>
        }
      >
        <div className="grid max-w-md gap-3">
          <CheckItem>Seekers: search guides by language, city and price.</CheckItem>
          <CheckItem>Guides: set your own availability and confirm requests.</CheckItem>
          <CheckItem>Free to join. You can switch between roles later by contacting us.</CheckItem>
        </div>
      </PageHero>
    </PublicShell>
  );
}
