"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GOOGLE_SCRIPT_URL = "https://accounts.google.com/gsi/client";
let googleScriptLoadingPromise = null;

function loadGoogleScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google login requires a browser environment."));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }

  if (googleScriptLoadingPromise) {
    return googleScriptLoadingPromise;
  }

  googleScriptLoadingPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google));
      existingScript.addEventListener("error", () => reject(new Error("Unable to load Google login script.")));
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Unable to load Google login script."));
    document.head.appendChild(script);
  });

  return googleScriptLoadingPromise;
}

export function GoogleAuthButton({ label = "Continue with Google", className = "", onSuccessUrl = "/dashboard/home" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCredentialResponse(response) {
    setLoading(true);
    const idToken = response?.credential;
    if (!idToken) {
      setError("Unable to sign in with Google. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const results = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        credentials: "same-origin",
      });

      const payload = await results.json();
      if (!results.ok || !payload.success) {
        throw new Error(payload.message || "Unable to sign in with Google.");
      }

      router.push(onSuccessUrl);
    } catch (err) {
      setError(err.message || "Unable to sign in with Google.");
      setLoading(false);
    }
  }

  async function handleClick(event) {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const href = event.currentTarget?.href;
    event.preventDefault();

    if (!googleClientId) {
      setError("Google login is not configured.");
      if (href) {
        window.location.href = href;
      }
      return;
    }

    try {
      const google = await loadGoogleScript();

      if (!google?.accounts?.id) {
        throw new Error("Google login is unavailable.");
      }

      setError("");

      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
        ux_mode: "popup",
      });

      google.accounts.id.prompt();
    } catch (err) {
      setError(err.message || "Unable to start Google login.");
      setLoading(false);
      if (href) {
        window.location.href = href;
      }
    }
  }
  return (
    <>
      <a
        href="/api/auth/google"
        className={`app-button app-button--outline w-full text-center ${className}`}
        onClick={handleClick}
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.2 12.3c0-.8-.1-1.6-.2-2.3H12v4.3h6.2c-.3 1.7-1.5 3.1-3.2 4l5.2 4.1c3-2.7 4.8-6.8 4.8-10.1z" fill="#4285F4" />
            <path d="M12 24c3.2 0 5.8-1.1 7.7-3l-5.2-4.1c-1.1.7-2.6 1.2-4.5 1.2-3.4 0-6.3-2.3-7.3-5.4H.5V17c2 4.1 6.1 7 11.5 7z" fill="#34A853" />
            <path d="M4.7 14.7c-.3-.9-.5-1.8-.5-2.7s.2-1.8.5-2.7V6.3H.5C-.5 8.1-1 10.1-1 12s.5 3.9 1.5 5.7l4.2-3z" fill="#FBBC05" />
            <path d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.8 1.1 15.2 0 12 0 6.6 0 2 2.9 .5 7.3l4.2 3c1-3.1 3.9-5.5 7.3-5.5z" fill="#EA4335" />
          </svg>
        </span>
        {loading ? "Signing in with Google…" : label}
      </a>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </>
  );
}
