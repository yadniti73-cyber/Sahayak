"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Avatar, Badge, Panel } from "./app-primitives";
import { ProfilePhotoUploader } from "./ProfilePhotoUploader";
import { getInitials, useAuth } from "./providers/AuthContext";

function Item({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-app-muted">{label}</dt>
      <dd className="mt-1 text-sm text-app-text">{value || <span className="text-app-muted">Not added yet</span>}</dd>
    </div>
  );
}

// Profile card for accounts with no role-specific profile (admins): view first, edit on request.
export function AccountProfile({ roleLabel = "Admin" }) {
  const { user, refreshUser } = useAuth();
  const [saved, setSaved] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", city: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function apply(profile) {
    setSaved(profile);
    setForm({ firstName: profile.firstName || "", lastName: profile.lastName || "", phone: profile.phone || "", city: profile.city || "" });
  }

  useEffect(() => {
    fetch("/api/profile", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((result) => {
        if (result?.success) apply(result.data.profile);
      })
      .catch(() => {});
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.message || "Unable to update profile.");
        setBusy(false);
        return;
      }
      apply(result.data.profile);
      await refreshUser();
      setMessage("Profile updated successfully.");
      setEditing(false);
    } catch {
      setError("Unable to update profile. Please try again.");
    }
    setBusy(false);
  }

  const fullName = [saved?.firstName, saved?.lastName].filter(Boolean).join(" ");

  if (!editing) {
    return (
      <Panel>
        {!saved ? (
          <p className="text-sm text-app-muted">Loading your profile...</p>
        ) : (
          <div className="grid gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar initials={getInitials(saved.firstName, saved.lastName)} src={user?.pictureUrl} alt={fullName} size="lg" />
                <div>
                  <h2 className="text-xl font-bold text-app-text">{fullName || "Your name"}</h2>
                  <p className="text-sm text-app-muted">{saved.email}</p>
                  <div className="mt-2"><Badge>{roleLabel}</Badge></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setMessage(""); setEditing(true); }}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-app-primary transition hover:bg-blue-50"
              >
                <Pencil size={16} aria-hidden="true" /> Edit profile
              </button>
            </div>
            {message ? <p role="status" className="text-sm text-emerald-600">{message}</p> : null}
            <dl className="grid gap-5 sm:grid-cols-2">
              <Item label="Phone" value={saved.phone} />
              <Item label="City" value={saved.city} />
            </dl>
          </div>
        )}
      </Panel>
    );
  }

  return (
    <Panel>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <ProfilePhotoUploader />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            First name
            <input className="app-input" value={form.firstName} onChange={set("firstName")} required />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Last name
            <input className="app-input" value={form.lastName} onChange={set("lastName")} required />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Phone
            <input className="app-input" value={form.phone} onChange={set("phone")} />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            City
            <input className="app-input" value={form.city} onChange={set("city")} />
          </label>
        </div>
        {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="app-button flex-1" disabled={busy}>{busy ? "Saving…" : "Save profile"}</button>
          <button
            type="button"
            onClick={() => { if (saved) apply(saved); setError(""); setEditing(false); }}
            disabled={busy}
            className="rounded-lg border border-app-border bg-white px-5 py-3 text-sm font-semibold text-app-muted transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </Panel>
  );
}
