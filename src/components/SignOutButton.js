"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export function SignOutButton({ className = "", children = "Sign out", iconOnly = false, onSignedOut }) {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
      if (onSignedOut) onSignedOut();
    } finally {
      window.location.assign("/login");
    }
  }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      aria-label={iconOnly ? "Sign out" : undefined}
      title={iconOnly ? "Sign out" : undefined}
      className={`inline-flex items-center gap-2 text-sm font-semibold transition disabled:opacity-60 ${className}`}
    >
      <LogOut size={iconOnly ? 19 : 16} aria-hidden="true" />
      {iconOnly ? null : loading ? "Signing out..." : children}
    </button>
  );
}
