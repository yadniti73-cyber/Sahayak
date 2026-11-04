"use client";

import { useEffect, useState } from "react";
import { Mail, Send, Star, Trash2, X } from "lucide-react";

const dateLabel = (value) => value
  ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
  : "Date unavailable";

export function AdminFeedbackManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("info");

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/feedback", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Unable to load feedback.");
      setItems(payload.data.feedback || []);
    } catch (error) {
      setNotice(error.message || "Unable to load feedback.");
      setNoticeType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function beginReply(item) {
    setReplyingId(item.id);
    setReplyMessage("");
    setNotice("");
  }

  function cancelReply() {
    setReplyingId("");
    setReplyMessage("");
  }

  async function sendReply(event, item) {
    event.preventDefault();
    if (!replyMessage.trim()) return;

    setBusy(true);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/feedback/${item.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Unable to send reply.");
      setReplyingId("");
      setReplyMessage("");
      setNotice(`Reply sent to ${payload.data?.recipient || item.email}.`);
      setNoticeType("success");
    } catch (error) {
      setNotice(error.message || "Unable to send reply.");
      setNoticeType("error");
    } finally {
      setBusy(false);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete feedback from ${item.name} (${item.email})? This cannot be undone.`)) return;
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/feedback/${item.id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Unable to delete feedback.");
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      if (replyingId === item.id) cancelReply();
      setNotice("Feedback deleted.");
      setNoticeType("success");
    } catch (error) {
      setNotice(error.message || "Unable to delete feedback.");
      setNoticeType("error");
    } finally {
      setBusy(false);
    }
  }

  const noticeClasses = noticeType === "error"
    ? "border-red-100 bg-red-50 text-red-700"
    : noticeType === "success"
      ? "border-green-100 bg-green-50 text-green-700"
      : "border-blue-100 bg-blue-50 text-app-primary";

  return (
    <div className="grid gap-4">
      {notice ? <p role="status" className={`rounded-xl border px-4 py-3 text-sm ${noticeClasses}`}>{notice}</p> : null}
      {loading ? <div className="rounded-2xl border border-app-border bg-white p-8 text-sm text-app-muted">Loading feedback…</div> : null}
      {!loading && items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-app-border bg-white/80 p-10 text-center">
          <h2 className="font-semibold text-app-text">No feedback received yet</h2>
          <p className="mt-1 text-sm text-app-muted">Submissions from the homepage form will appear here.</p>
        </div>
      ) : null}
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-app-border border-t-4 border-t-green-500 bg-white/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="font-semibold text-app-text">{item.name}</h2>
              <a className="mt-0.5 block text-sm text-app-primary hover:underline" href={`mailto:${item.email}`}>{item.email}</a>
              <p className="mt-2 text-xs text-app-muted">{item.topic} · {dateLabel(item.createdAt)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-amber-500" aria-label={item.rating ? `${item.rating} out of 5 stars` : "No rating"}>
              {item.rating ? <>{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={15} className={n <= item.rating ? "fill-current" : "text-slate-200"} />)}<span className="ml-1 text-xs font-semibold text-app-muted">{item.rating}/5</span></> : <span className="text-xs text-app-muted">No rating</span>}
            </div>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-app-text">{item.message}</p>

          {replyingId === item.id ? (
            <form onSubmit={(event) => sendReply(event, item)} className="mt-5 grid gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-app-text">Reply by email</h3>
                  <p className="mt-0.5 text-xs text-app-muted">To: {item.email}</p>
                </div>
                <button type="button" onClick={cancelReply} disabled={busy} className="rounded-lg p-2 text-app-muted transition hover:bg-white hover:text-app-text focus:outline-none focus:ring-2 focus:ring-app-primary" aria-label="Close reply"><X size={17}/></button>
              </div>
              <textarea
                className="app-input min-h-32 w-full resize-y"
                required
                maxLength={10000}
                value={replyMessage}
                onChange={(event) => setReplyMessage(event.target.value)}
                placeholder="Write your response to this feedback…"
                aria-label={`Email reply to ${item.email}`}
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-app-muted">Sent from the configured GuideShala Gmail account.</span>
                <div className="flex gap-2">
                  <button type="button" onClick={cancelReply} disabled={busy} className="rounded-lg border border-app-border bg-white px-3 py-2 text-sm font-semibold text-app-text transition hover:bg-blue-50 disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={busy || !replyMessage.trim()} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-app-primary to-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"><Send size={15}/>{busy ? "Sending…" : "Send reply"}</button>
                </div>
              </div>
            </form>
          ) : null}

          <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-app-border pt-4">
            <button type="button" disabled={busy} onClick={() => beginReply(item)} className="inline-flex items-center gap-2 rounded-lg border border-app-border px-3 py-2 text-sm font-semibold text-app-primary transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-2 disabled:opacity-50"><Mail size={15}/>Reply</button>
            <button type="button" disabled={busy} onClick={() => remove(item)} className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-50"><Trash2 size={15}/>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}
