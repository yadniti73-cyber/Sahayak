"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { CATEGORY_ICON_NAMES } from "@/lib/category-presets";

export function AddCategoryForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", description: "", icon: "BookOpen" });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function close() {
    setOpen(false);
    setError("");
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Unable to create category.");
      setForm({ name: "", description: "", icon: "BookOpen" });
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="app-button">
        <Plus size={16} aria-hidden="true" /> Add category
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="app-card w-full max-w-xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">New category</h2>
        <button type="button" onClick={close} aria-label="Close" className="rounded p-1 text-app-muted hover:bg-slate-100">
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-1 text-sm font-semibold">
          Name
          <input className="app-input font-normal" required minLength={2} maxLength={60} value={form.name} onChange={set("name")} placeholder="e.g. Sports Coaching" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Description
          <textarea className="app-input font-normal" rows={2} maxLength={200} value={form.description} onChange={set("description")} placeholder="One line on what guidance this covers" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Icon
          <select className="app-input font-normal" value={form.icon} onChange={set("icon")}>
            {CATEGORY_ICON_NAMES.map((name) => <option key={name}>{name}</option>)}
          </select>
        </label>
        {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
        <div className="flex gap-3">
          <button type="submit" disabled={busy} className="app-button disabled:opacity-60">{busy ? "Saving..." : "Create category"}</button>
          <button type="button" onClick={close} className="app-button--outline">Cancel</button>
        </div>
      </div>
    </form>
  );
}
