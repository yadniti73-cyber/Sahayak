"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext({
  user: null,
  loading: true,
  refreshUser: async () => null,
  clearUser: () => {},
});

// initialUser lets server layouts (which already know who is signed in) hand the user over,
// so there is no flash of an empty avatar. Without it the provider asks /api/auth/me once.
export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" });
      const data = res.ok ? await res.json() : null;
      const next = data?.success && data?.data?.user ? data.data.user : null;
      setUser(next);
      return next;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!initialUser) refreshUser();
  }, [initialUser, refreshUser]);

  const value = useMemo(() => ({ user, loading, refreshUser, clearUser }), [user, loading, refreshUser, clearUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function getInitials(firstName, lastName) {
  const first = (firstName || "").trim();
  const last = (lastName || "").trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  if (last) return last.slice(0, 2).toUpperCase();
  return "?";
}
