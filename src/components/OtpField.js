"use client";

// Six-digit code input. Digits only; works with mobile one-time-code autofill.
export function OtpField({ value, onChange, disabled = false, label = "Verification code" }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-app-text">
      {label}
      <input
        className="app-input text-center text-2xl font-semibold tracking-[0.5em]"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={6}
        placeholder="••••••"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        required
      />
    </label>
  );
}
