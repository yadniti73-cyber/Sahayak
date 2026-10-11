"use client";

import { useState } from "react";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";

export const passwordRules = [
  ["At least 8 characters", (v) => v.length >= 8],
  ["An uppercase letter", (v) => /[A-Z]/.test(v)],
  ["A lowercase letter", (v) => /[a-z]/.test(v)],
  ["A number", (v) => /\d/.test(v)],
  ["A special character", (v) => /[^A-Za-z0-9]/.test(v)],
];

export const isStrongPassword = (value) => passwordRules.every(([, test]) => test(value));

export function PasswordField({ label, value, onChange, placeholder, autoComplete, showRules = false }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="grid gap-2">
      <label className="grid gap-2 text-sm font-semibold text-app-text">
        {label}
        <span className="relative block">
          <input
            className="app-input w-full pr-11"
            type={visible ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            required
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted transition hover:text-app-primary"
          >
            {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </span>
      </label>
      {showRules && value ? (
        <ul className="grid gap-1 text-xs sm:grid-cols-2" aria-live="polite">
          {passwordRules.map(([text, test]) => {
            const ok = test(value);
            return (
              <li key={text} className={`flex items-center gap-1.5 ${ok ? "text-emerald-700" : "text-app-muted"}`}>
                {ok ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
                {text}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function FormAlert({ type = "error", children }) {
  if (!children) return null;
  const styles =
    type === "success"
      ? "bg-emerald-50 text-emerald-800 border-emerald-100"
      : "bg-red-50 text-red-700 border-red-100";
  return (
    <p role={type === "success" ? "status" : "alert"} className={`rounded-lg border px-3 py-2 text-sm ${styles}`}>
      {children}
    </p>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-xs font-semibold uppercase text-app-muted">
      <span className="h-px flex-1 bg-app-border" />
      or
      <span className="h-px flex-1 bg-app-border" />
    </div>
  );
}

export function SubmitButton({ loading, children, loadingText }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-app-primary bg-app-primary px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-app-primaryDark hover:shadow-soft disabled:translate-y-0 disabled:opacity-60"
    >
      {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
      {loading ? loadingText : children}
    </button>
  );
}
