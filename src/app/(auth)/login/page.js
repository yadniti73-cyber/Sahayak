"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { PublicShell } from "@/components";
import { HeroIconBackdrop } from "@/components/HeroIconBackdrop";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { Eyebrow, Hl } from "@/components/gs-ui";
import { useAuth } from "@/components/providers";
import { safeNextPath } from "@/lib/safe-redirect";
import {
  FormAlert,
  PasswordField,
  SubmitButton,
} from "@/components/auth-fields";

const GOOGLE_ERROR_MESSAGES = {
  google_auth_denied: "Google sign-in was cancelled.",
  google_auth_invalid_state: "Your sign-in session expired. Please try again.",
  google_auth_failed: "Unable to sign in with Google. Please try again.",
};

const GOOGLE_REASON_HINTS = {
  redirect_uri_mismatch:
    "Google rejected the redirect address. It must exactly match an Authorised redirect URI in Google Cloud (and GOOGLE_REDIRECT_URI, if set).",
  invalid_client:
    "The Google client ID or client secret is wrong. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
  unauthorized_client:
    "This Google client is not allowed to use this sign-in flow.",
  invalid_grant:
    "The Google sign-in code expired or was already used. Please try again.",
  missing_credentials:
    "GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing on the server.",
  token_exchange_failed:
    "Google would not exchange the sign-in code. See the server log for details.",
  server_error:
    "Something failed on the server after Google sign-in. See the server log for details.",
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
    return (
      <FormAlert type="success">
        Password updated. Sign in with your new password.
      </FormAlert>
    );
  }
  return null;
}

const features = [
  ["🎯", "Manage bookings and upcoming sessions"],
  ["❤️", "Save mentors you want to talk to again"],
  ["🔔", "See notifications from your guides"],
];

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [asRole, setAsRole] = useState("USER"); // USER | GUIDE (only changes where "Create account" leads)
  const [tab, setTab] = useState("email"); // email | phone
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
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
      const next = safeNextPath(
        new URLSearchParams(window.location.search).get("next"),
      );
      router.push(next || result.data?.redirectTo || "/dashboard/home");
      router.refresh();
    } catch (err) {
      setError("Unable to sign in. Please try again.");
      setLoading(false);
    }
  }

  function handlePhone(event) {
    event.preventDefault();
    setError(
      "Phone OTP sign-in is not available yet. Please continue with Google or your email and password.",
    );
  }

  const tabCls = (active) =>
    `inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-semibold transition ${
      active
        ? "border-[#0b1736] text-[#0b1736]"
        : "border-transparent text-slate-500 hover:text-[#0b1736]"
    }`;

  return (
    <PublicShell>
      <section className="relative overflow-hidden py-14 lg:py-20">
        <HeroIconBackdrop />
        <div className="app-container relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Eyebrow>Welcome back</Eyebrow>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#0b1736] sm:text-5xl lg:text-6xl">
              Continue your guidance <Hl>journey</Hl>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
              Sign in to manage bookings, save mentors, view notifications, and
              return to your dashboard.
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
              Built by IITians from IIT Indore to guarantee reliable and
              verified mentorship.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
            <div className="grid gap-5 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg font-bold text-[#0b1736]">
                  Login as:
                </span>
                <div
                  role="group"
                  aria-label="Login as"
                  className="inline-flex rounded-full bg-slate-100 p-1"
                >
                  {[
                    ["USER", "User"],
                    ["GUIDE", "Guide"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAsRole(value)}
                      aria-pressed={asRole === value}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        asRole === value
                          ? "bg-[#0b1736] text-white shadow"
                          : "text-slate-600 hover:text-[#0b1736]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Suspense fallback={null}>
                <LoginNotices />
              </Suspense>

              <GoogleAuthButton className="!rounded-xl !py-3.5 !text-base" />

              <div
                className="flex items-center gap-3 text-sm font-medium text-slate-400"
                aria-hidden="true"
              >
                <span className="h-px flex-1 border-t border-dashed border-slate-300" />
                OR
                <span className="h-px flex-1 border-t border-dashed border-slate-300" />
              </div>

              <div
                className="flex gap-6 border-b border-slate-200"
                role="tablist"
                aria-label="Sign-in method"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "phone"}
                  onClick={() => {
                    setTab("phone");
                    setError("");
                  }}
                  className={tabCls(tab === "phone")}
                >
                  <Phone size={17} aria-hidden="true" /> Login via Phone / OTP
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "email"}
                  onClick={() => {
                    setTab("email");
                    setError("");
                  }}
                  className={tabCls(tab === "email")}
                >
                  <Mail size={17} aria-hidden="true" /> via Email / Password
                </button>
              </div>

              {tab === "phone" ? (
                <form className="grid gap-4" onSubmit={handlePhone}>
                  <label className="grid gap-2 text-sm font-semibold text-slate-600">
                    Phone Number
                    <span className="flex gap-3">
                      <select
                        aria-label="Country code"
                        className="app-input !w-24 !rounded-xl"
                        defaultValue="+91"
                      >
                        <option value="+91">+91</option>
                      </select>
                      <input
                        className="app-input !rounded-xl"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="Enter mobile number"
                        value={phone}
                        onChange={(e) =>
                          setPhone(
                            e.target.value.replace(/[^\d]/g, "").slice(0, 10),
                          )
                        }
                      />
                    </span>
                  </label>
                  <FormAlert>{error}</FormAlert>
                  <button
                    type="submit"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0b1736] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#15275a]"
                  >
                    Send OTP (One-Time Password){" "}
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                  <p className="text-center text-sm text-slate-600">
                    Prefer email?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setTab("email");
                        setError("");
                      }}
                      className="font-semibold text-blue-700 hover:underline"
                    >
                      Login with Password
                    </button>
                  </p>
                </form>
              ) : (
                <form className="grid gap-4" onSubmit={handleSubmit}>
                  <label className="grid gap-2 text-sm font-semibold text-slate-600">
                    Email
                    <input
                      className="app-input !rounded-xl"
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
                    <Link
                      href="/forgot-password"
                      className="font-semibold text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormAlert>{error}</FormAlert>
                  <SubmitButton loading={loading} loadingText="Signing in...">
                    Sign in <ArrowRight size={18} aria-hidden="true" />
                  </SubmitButton>
                </form>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-5 text-center text-[15px] text-slate-600">
              New to GuideShala?{" "}
              <Link
                href={
                  asRole === "GUIDE" ? "/register?role=mentor" : "/register"
                }
                onClick={(event) => {
                  const next = new URLSearchParams(window.location.search).get(
                    "next",
                  );
                  const params = new URLSearchParams();
                  if (asRole === "GUIDE") params.set("role", "mentor");
                  if (next) params.set("next", next);
                  const qs = params.toString();
                  event.currentTarget.href = qs
                    ? `/register?${qs}`
                    : "/register";
                }}
                className="font-semibold text-emerald-700 hover:underline"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
