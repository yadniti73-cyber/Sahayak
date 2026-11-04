"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Check, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import { CATEGORY_ICON_NAMES } from "@/lib/category-presets";
import { categoryIconMap } from "@/components/category-icons";

const emptyForm = { name: "", description: "", icon: "BookOpen" };

export function AdminCategoryManager({ categories = [] }) {
  const router = useRouter();
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function startEdit(category, menu) {
    menu?.removeAttribute("open");
    setEditingSlug(category.slug);
    setForm({ name: category.name || "", description: category.description || "", icon: category.icon || "BookOpen" });
    setError("");
    setNotice("");
  }

  function cancelEdit() {
    setEditingSlug(null);
    setForm(emptyForm);
    setError("");
  }

  async function saveEdit(event) {
    event.preventDefault();
    if (!editingSlug) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/categories/${encodeURIComponent(editingSlug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to update category.");
      setNotice("Category updated successfully.");
      setEditingSlug(null);
      setForm(emptyForm);
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to update category.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteCategory(category, menu) {
    menu?.removeAttribute("open");
    const confirmed = window.confirm(`Delete the category “${category.name}”? This cannot be undone from the admin panel.`);
    if (!confirmed) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/categories/${encodeURIComponent(category.slug)}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to delete category.");
      setNotice(`${category.name} was removed.`);
      if (editingSlug === category.slug) cancelEdit();
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to delete category.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="grid gap-4">
      {notice ? <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p> : null}
      {error && !editingSlug ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const Icon = categoryIconMap[category.icon] || BookOpen;
          const isEditing = editingSlug === category.slug;
          return (
            <article key={category.slug} className="app-card p-5">
              {isEditing ? (
                <form onSubmit={saveEdit} className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-app-text">Edit category</h3>
                    <button type="button" onClick={cancelEdit} aria-label="Cancel editing" className="rounded-lg p-1.5 text-app-muted hover:bg-slate-100"><X size={17} /></button>
                  </div>
                  <label className="grid gap-1 text-sm font-semibold">Name<input className="app-input font-normal" required minLength={2} maxLength={60} value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} /></label>
                  <label className="grid gap-1 text-sm font-semibold">Description<textarea className="app-input font-normal" rows={3} maxLength={200} value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} /></label>
                  <label className="grid gap-1 text-sm font-semibold">Icon<select className="app-input font-normal" value={form.icon} onChange={(e) => setForm((v) => ({ ...v, icon: e.target.value }))}>{CATEGORY_ICON_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
                  {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
                  <div className="flex flex-wrap gap-2">
                    <button type="submit" disabled={busy} className="app-button disabled:opacity-60"><Check size={16} />{busy ? "Saving..." : "Save changes"}</button>
                    <button type="button" disabled={busy} onClick={cancelEdit} className="app-button--outline">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <span className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-app-primary"><Icon size={20} aria-hidden="true" /></span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-app-text">{category.name}</h3>
                      <p className="mt-1 text-xs text-app-muted">{category.mentorCount || 0} active verified mentors</p>
                    </div>
                    <details className="relative shrink-0">
                      <summary
                        aria-label={`More actions for ${category.name}`}
                        title="More actions"
                        className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-app-muted transition hover:bg-slate-100 hover:text-app-text focus:outline-none focus-visible:ring-2 focus-visible:ring-app-primary [&::-webkit-details-marker]:hidden"
                      >
                        <MoreVertical size={19} aria-hidden="true" />
                      </summary>
                      <div className="absolute right-0 top-10 z-20 min-w-40 overflow-hidden rounded-xl border border-app-border bg-white p-1.5 shadow-lg">
                        <button type="button" disabled={busy} onClick={(event) => startEdit(category, event.currentTarget.closest("details"))} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-app-text transition hover:bg-slate-50 disabled:opacity-50">
                          <Pencil size={15} /> Edit category
                        </button>
                        <button type="button" disabled={busy} onClick={(event) => deleteCategory(category, event.currentTarget.closest("details"))} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50">
                          <Trash2 size={15} /> Delete category
                        </button>
                      </div>
                    </details>
                  </div>
                  <p className="mt-4 min-h-10 text-sm leading-6 text-app-muted">{category.description || "No description provided."}</p>
                  <div className="mt-4 border-t border-app-border pt-4" />
                </>
              )}
            </article>
          );
        })}
      </div>
      {categories.length === 0 ? <div className="app-card p-6 text-center text-sm text-app-muted">No categories found. Add your first category above.</div> : null}
    </section>
  );
}
