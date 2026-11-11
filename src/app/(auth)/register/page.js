"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PublicShell } from "@/components";
import { HeroIconBackdrop } from "@/components/HeroIconBackdrop";
import { Eyebrow, Hl } from "@/components/gs-ui";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { OtpField } from "@/components/OtpField";
import { useAuth } from "@/components/providers";
import { ROLE_HOME_ROUTES } from "@/lib/routes";
import { safeNextPath } from "@/lib/safe-redirect";
import { FormAlert, PasswordField, SubmitButton, isStrongPassword } from "@/components/auth-fields";

const roles = [
  { value: "SEEKER", label: "User" },
  { value: "MENTOR", label: "Guide" },
];

const features = [
  ["🎯", "Search guides by language, city and price"],
  ["❤️", "Save mentors you want to talk to again"],
  ["🗓️", "Guides: set your own availability and confirm requests"],
];

function RegisterForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(searchParams.get("role")?.toLowerCase() === "mentor" ? "MENTOR" : "SEEKER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("details"); // "details" -> "verify"
  const [code, setCode] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function postJson(url, body) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin",
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      const err = new Error(result.message || "Something went wrong. Please try again.");
      err.retryAfter = result?.data?.retryAfter;
      throw err;
    }
    return result;
  }

  async function sendCode() {
    try {
      const result = await postJson("/api/auth/otp/send", { email, purpose: "REGISTER", firstName });
      setCooldown(result.data?.retryAfter ?? 60);
    } catch (err) {
      if (err.retryAfter) setCooldown(err.retryAfter);
      throw err;
    }
  }

  async function handleResend() {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await sendCode();
      setInfo("A new code has been sent.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");

    if (step === "details") {
      if (!isStrongPassword(password)) {
        setError("Please meet all the password requirements.");
        return;
      }
      setLoading(true);
      try {
        await sendCode();
        setStep("verify");
        setInfo(`We sent a 6-digit code to ${email}. It expires in 10 minutes.`);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      await postJson("/api/auth/otp/verify", { email, purpose: "REGISTER", code });
      const result = await postJson("/api/auth/register", { firstName, lastName, email, password, role });
      await refreshUser();
      router.push(safeNextPath(searchParams.get("next")) || ROLE_HOME_ROUTES[result.data?.user?.role] || "/dashboard/home");
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to create account. Please try again.");
      setLoading(false);
    }
  }

  const inputCls = "app-input !rounded-xl";
  const labelCls = "grid gap-2 text-sm font-semibold text-slate-600";

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
      <div className="grid gap-5 p-6 sm:p-8">
        {step === "details" ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg font-bold text-[#0b1736]">Sign up as:</span>
            <div role="group" aria-label="Sign up as" className="inline-flex rounded-full bg-slate-100 p-1">
              {roles.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  aria-pressed={role === value}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    role === value ? "bg-[#0b1736] text-white shadow" : "text-slate-600 hover:text-[#0b1736]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <GoogleAuthButton className="!rounded-xl !py-3.5 !text-base" />

        <div className="flex items-center gap-3 text-sm font-medium text-slate-400" aria-hidden="true">
          <span className="h-px flex-1 border-t border-dashed border-slate-300" />
          OR
          <span className="h-px flex-1 border-t border-dashed border-slate-300" />
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {step === "details" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelCls}>
                  First name
                  <input className={inputCls} placeholder="First name" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </label>
                <label className={labelCls}>
                  Last name
                  <input className={inputCls} placeholder="Last name" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </label>
              </div>
              <label className={labelCls}>
                Email
                <input className={inputCls} type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <PasswordField
                label="Password"
                placeholder="Create password"
                autoComplete="new-password"
                showRules
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          ) : (
            <div className="grid gap-4">
              <p className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-[#0b1736]">
                Verifying <strong>{email}</strong>
              </p>
              <OtpField value={code} onChange={setCode} disabled={loading} />
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="font-semibold text-emerald-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
                  disabled={loading || cooldown > 0}
                  onClick={handleResend}
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                </button>
                <button
                  type="button"
                  className="text-slate-500 hover:underline"
                  onClick={() => { setStep("details"); setCode(""); setError(""); setInfo(""); }}
                >
                  Change email
                </button>
              </div>
            </div>
          )}

          {info && !error ? <FormAlert type="success">{info}</FormAlert> : null}
          <FormAlert>{error}</FormAlert>
          <SubmitButton loading={loading} loadingText={step === "details" ? "Sending code..." : "Creating account..."}>
            {step === "details" ? "Create account" : "Verify & create account"} <ArrowRight size={18} aria-hidden="true" />
          </SubmitButton>
        </form>
      </div>

      <div className="bg-slate-50 px-6 py-5 text-center text-[15px] text-slate-600">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-emerald-700 hover:underline">Sign in</Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden py-14 lg:py-20">
        <HeroIconBackdrop />
        <div className="app-container relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Eyebrow>Create account</Eyebrow>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#0b1736] sm:text-5xl lg:text-6xl">
              Start your guidance <Hl>journey</Hl>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
              Sign up to save mentors, request sessions, and manage your guidance journey. Free to join.
            </p>
            <ul className="mt-9 grid gap-4 text-lg text-[#0b1736]">
              {features.map(([emoji, text]) => (
                <li key={text} className="flex items-center gap-3">
                  <span aria-hidden="true">{emoji}</span> {text}
                </li>
              ))}
            </ul>
            <p className="mt-9 flex max-w-lg gap-3 text-lg text-[#0b1736]">
              <span aria-hidden="true">🎓</span>
              Built by IITians from IIT Indore to guarantee reliable and verified mentorship.
            </p>
          </div>

          <Suspense fallback={null}>
            <RegisterForm />
          </Suspense>
        </div>
      </section>
    </PublicShell>
  );
}
