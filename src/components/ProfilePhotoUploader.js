"use client";

import { useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { Avatar } from "./app-primitives";
import { getInitials, useAuth } from "./providers/AuthContext";

const SIZE = 256; // px, square

// Center-crops to a square and re-encodes as a small JPEG so it can be stored on the user record.
function resizeToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file is not a readable image."));
    };
    img.src = url;
  });
}

export function ProfilePhotoUploader() {
  const { user, refreshUser } = useAuth();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(pictureUrl) {
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pictureUrl }),
      credentials: "same-origin",
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || "Unable to update photo.");
    await refreshUser();
  }

  async function onPick(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setBusy(true);
    try {
      await save(await resizeToDataUrl(file));
    } catch (err) {
      setError(err.message || "Unable to update photo.");
    } finally {
      setBusy(false);
    }
  }

  async function onRemove() {
    setError("");
    setBusy(true);
    try {
      await save("");
    } catch (err) {
      setError(err.message || "Unable to remove photo.");
    } finally {
      setBusy(false);
    }
  }

  const name = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "";

  return (
    <div className="flex items-center gap-4">
      <Avatar initials={getInitials(user?.firstName, user?.lastName)} src={user?.pictureUrl} alt={name} size="lg" />
      <div className="grid gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-app-border bg-white px-3 py-2 text-sm font-semibold text-app-primary transition hover:bg-blue-50 disabled:opacity-60"
          >
            <Camera size={16} aria-hidden="true" />
            {busy ? "Saving..." : user?.pictureUrl ? "Change photo" : "Upload photo"}
          </button>
          {user?.pictureUrl ? (
            <button
              type="button"
              onClick={onRemove}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-app-muted transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
            >
              <Trash2 size={16} aria-hidden="true" />
              Remove
            </button>
          ) : null}
        </div>
        <p className="text-xs text-app-muted">JPG, PNG or WebP. Cropped to a square.</p>
        {error ? <p role="alert" className="text-xs text-red-600">{error}</p> : null}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="sr-only" aria-label="Choose profile photo" />
    </div>
  );
}
