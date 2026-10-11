"use client";

export function GoogleAuthButton({ label = "Continue with Google", className = "" }) {
  return (
    <a
      href="/api/auth/google"
      className={`inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-app-border bg-white px-5 py-3 text-sm font-semibold text-app-text transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:shadow-soft ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.2 12.3c0-.8-.1-1.6-.2-2.3H12v4.3h6.2c-.3 1.7-1.5 3.1-3.2 4l5.2 4.1c3-2.7 4.8-6.8 4.8-10.1z" fill="#4285F4" />
        <path d="M12 24c3.2 0 5.8-1.1 7.7-3l-5.2-4.1c-1.1.7-2.6 1.2-4.5 1.2-3.4 0-6.3-2.3-7.3-5.4H.5V17c2 4.1 6.1 7 11.5 7z" fill="#34A853" />
        <path d="M4.7 14.7c-.3-.9-.5-1.8-.5-2.7s.2-1.8.5-2.7V6.3H.5C-.5 8.1-1 10.1-1 12s.5 3.9 1.5 5.7l4.2-3z" fill="#FBBC05" />
        <path d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.8 1.1 15.2 0 12 0 6.6 0 2 2.9 .5 7.3l4.2 3c1-3.1 3.9-5.5 7.3-5.5z" fill="#EA4335" />
      </svg>
      {label}
    </a>
  );
}
