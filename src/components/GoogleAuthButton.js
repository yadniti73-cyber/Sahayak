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
        {loading ? "Signing in with Google…" : label}
      </a>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </>
  );
}
