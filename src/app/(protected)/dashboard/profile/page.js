"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { DashboardShell, Avatar, Panel, SectionHeading } from "@/components";
import { ProfilePhotoUploader } from "@/components/ProfilePhotoUploader";
import { getInitials, useAuth } from "@/components/providers";

function Field({ label, value, wide = false }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-app-muted">{label}</dt>
      <dd className="mt-1 whitespace-pre-line text-sm text-app-text">{value || <span className="text-app-muted">Not added yet</span>}</dd>
    </div>
  );
}

export default function SeekerProfilePage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function applyProfile(profile) {
    setFirstName(profile.firstName || "");
    setLastName(profile.lastName || "");
    setCity(profile.city || "");
    setPhone(profile.phone || "");
    setPreferredLanguage(profile.preferredLanguage || "");
    setBio(profile.bio || "");
    setSaved(profile);
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile", { credentials: "same-origin" });
        const result = await response.json();
        if (response.ok && result.success) {
          const profile = result.data.profile;
          applyProfile(profile);
          // A brand-new profile has nothing to show yet, so start on the form.
          setEditing(!(profile.city || profile.phone || profile.preferredLanguage || profile.bio));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoaded(true);
      }
    }

    fetchProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, city, phone, preferredLanguage, bio }),
        credentials: "same-origin",
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.message || "Unable to update profile.");
        setLoading(false);
        return;
      }
      applyProfile(result.data.profile);
      await refreshUser(); // keeps the name in the sidebar in sync
      setMessage("Profile updated successfully.");
      setEditing(false);
      setLoading(false);
    } catch (err) {
      setError("Unable to update profile. Please try again.");
      setLoading(false);
    }
  }

  function cancelEdit() {
    if (saved) applyProfile(saved);
    setError("");
    setEditing(false);
  }

  const fullName = [saved?.firstName, saved?.lastName].filter(Boolean).join(" ");

  return (
    <DashboardShell role="seeker" title="Profile">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          eyebrow="Profile"
          title="Keep your guidance context clear"
          description="A useful profile helps mentors understand your city, language preference, and current goals."
        />
        {!editing ? (
          <Panel>
            {!loaded ? (
              <p className="text-sm text-app-muted">Loading your profile...</p>
            ) : (
              <div className="grid gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar initials={getInitials(saved?.firstName, saved?.lastName)} src={user?.pictureUrl} alt={fullName} size="lg" />
                    <div>
                      <h2 className="text-xl font-bold text-app-text">{fullName || "Your name"}</h2>
                      <p className="text-sm text-app-muted">{saved?.email}</p>
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
                  <Field label="City" value={saved?.city} />
                  <Field label="Preferred language" value={saved?.preferredLanguage} />
                  <Field label="Phone" value={saved?.phone} />
                  <Field label="Guidance you are seeking" value={saved?.bio} wide />
                </dl>
              </div>
            )}
          </Panel>
        ) : (
        <Panel>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <ProfilePhotoUploader />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                First name
                <input
                  className="app-input"
                  placeholder="First name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Last name
                <input
                  className="app-input"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                City
                <input
                  className="app-input"
                  placeholder="City"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Preferred language
                <input
                  className="app-input"
                  placeholder="Preferred language"
                  value={preferredLanguage}
                  onChange={(event) => setPreferredLanguage(event.target.value)}
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold">
              Phone
              <input
                className="app-input"
                placeholder="Phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              What kind of guidance are you seeking?
              <textarea
                className="app-input min-h-32"
                placeholder="What kind of guidance are you seeking?"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
              />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="app-button flex-1" disabled={loading}>
                {loading ? "Saving…" : "Save profile"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading || !saved}
                className="rounded-lg border border-app-border bg-white px-5 py-3 text-sm font-semibold text-app-muted transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        </Panel>
        )}
      </div>
    </DashboardShell>
  );
}
