"use client";

import { useEffect, useState } from "react";
import { DashboardShell, Panel, SectionHeading } from "@/components";

export default function SeekerProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile", { credentials: "same-origin" });
        const result = await response.json();
        if (response.ok && result.success) {
          const profile = result.data.profile;
          setFirstName(profile.firstName || "");
          setLastName(profile.lastName || "");
          setCity(profile.city || "");
          setPhone(profile.phone || "");
          setPreferredLanguage(profile.preferredLanguage || "");
          setBio(profile.bio || "");
        }
      } catch (err) {
        console.error(err);
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
      setMessage("Profile updated successfully.");
      setLoading(false);
    } catch (err) {
      setError("Unable to update profile. Please try again.");
      setLoading(false);
    }
  }

  return (
    <DashboardShell role="seeker" title="Profile">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          eyebrow="Profile"
          title="Keep your guidance context clear"
          description="A useful profile helps mentors understand your city, language preference, and current goals."
        />
        <Panel>
          <form className="grid gap-4" onSubmit={handleSubmit}>
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
            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
            <button type="submit" className="app-button w-full" disabled={loading}>
              {loading ? "Saving…" : "Save profile"}
            </button>
          </form>
        </Panel>
      </div>
    </DashboardShell>
  );
}
