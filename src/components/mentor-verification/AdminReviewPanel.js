"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MessageSquareWarning, ShieldOff, XCircle } from "lucide-react";

const btn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export function AdminReviewPanel({ profileId, status }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function act(action) {
    setError("");
    setBusy(action);
    try {
      const res = await fetch(`/api/admin/mentors/${profileId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note, verifiedDocuments: checked }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Could not save your decision.");
      setNote("");
      setChecked(false);
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy("");
    }
  }

  if (status === "APPROVED") {
    return (
      <div className="grid gap-3">
        <p className="text-sm text-app-muted">This mentor is verified and visible to seekers. You can withdraw verification if something is wrong.</p>
        <label className="grid gap-1 text-sm font-semibold">
          Reason (sent to the mentor)
          <textarea className="app-input min-h-24" value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} />
        </label>
        {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
        <button type="button" disabled={Boolean(busy)} onClick={() => act("revoke")} className={`${btn} w-fit border-red-600 bg-red-600 text-white hover:bg-red-700`}>
          <ShieldOff size={16} aria-hidden="true" /> {busy === "revoke" ? "Working..." : "Withdraw verification"}
        </button>
      </div>
    );
  }

  if (status !== "SUBMITTED") {
    return (
      <p className="text-sm text-app-muted">
        {status === "DRAFT"
          ? "The mentor has not submitted their application yet. You can review it once they do."
          : "Waiting for the mentor to update and resubmit their application."}
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" className="mt-1 h-4 w-4" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        <span>I have opened and checked the resume, certificates and government ID, and the details match.</span>
      </label>

      <label className="grid gap-1 text-sm font-semibold">
        Note to the mentor <span className="font-normal text-app-muted">(required to request changes or reject)</span>
        <textarea className="app-input min-h-24" value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} />
      </label>

      {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={Boolean(busy) || !checked} onClick={() => act("approve")} className={`${btn} border-green-600 bg-green-600 text-white hover:bg-green-700`}>
          <CheckCircle2 size={16} aria-hidden="true" /> {busy === "approve" ? "Approving..." : "Approve & verify"}
        </button>
        <button type="button" disabled={Boolean(busy) || note.trim().length < 5} onClick={() => act("request_changes")} className={`${btn} border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100`}>
          <MessageSquareWarning size={16} aria-hidden="true" /> {busy === "request_changes" ? "Sending..." : "Request changes"}
        </button>
        <button type="button" disabled={Boolean(busy) || note.trim().length < 5} onClick={() => act("reject")} className={`${btn} border-red-200 bg-white text-red-700 hover:bg-red-50`}>
          <XCircle size={16} aria-hidden="true" /> {busy === "reject" ? "Rejecting..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
