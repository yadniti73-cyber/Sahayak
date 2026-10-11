"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Panel } from "@/components";
import { FormAlert } from "@/components/auth-fields";

const CHECKS = [
  ["identity", "Government ID is genuine and matches the name and photo"],
  ["education", "Education details match the certificates uploaded"],
  ["experience", "Experience is credible for the category and resume"],
];

export function MentorReviewActions({ profileId, status, verified }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [checklist, setChecklist] = useState({ identity: false, education: false, experience: false });
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const canDecide = status === "PENDING_REVIEW";
  if (!canDecide && !verified) {
    return <Panel><p className="text-sm text-app-muted">Nothing to review. A decision can be made once the mentor submits an application.</p></Panel>;
  }

  async function decide(decision) {
    if (decision === "REVOKE" && !window.confirm("Remove this mentor from the portal? They will be hidden from seekers immediately.")) return;
    setBusy(decision);
    setError("");
    setDone("");
    try {
      const res = await fetch(`/api/admin/mentors/${profileId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ decision, note, checklist }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error([json.message, ...(json.errors || [])].filter(Boolean).join(" "));
      setDone("Decision saved. The mentor has been notified.");
      setNote("");
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy("");
    }
  }

  const btn = "inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
  const spin = (k) => (busy === k ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null);

  return (
    <Panel>
      <h2 className="text-lg font-bold">Decision</h2>
      {canDecide ? (
        <>
          <fieldset className="mt-4 grid gap-2">
            <legend className="text-sm font-semibold">Before approving, confirm you checked:</legend>
            {CHECKS.map(([key, label]) => (
              <label key={key} className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" checked={checklist[key]} onChange={(e) => setChecklist((c) => ({ ...c, [key]: e.target.checked }))} />
                {label}
              </label>
            ))}
          </fieldset>
          <label className="mt-4 grid gap-2 text-sm font-semibold">
            Note to mentor <span className="text-xs font-normal text-app-muted">(required for "request changes" and "reject")</span>
            <textarea className="app-input min-h-24" value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
        </>
      ) : (
        <label className="mt-4 grid gap-2 text-sm font-semibold">
          Reason for removing verification
          <textarea className="app-input min-h-24" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      )}

      {error ? <div className="mt-4"><FormAlert>{error}</FormAlert></div> : null}
      {done ? <div className="mt-4"><FormAlert type="success">{done}</FormAlert></div> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {canDecide ? (
          <>
            <button type="button" disabled={Boolean(busy)} onClick={() => decide("APPROVE")} className={`${btn} bg-green-600 text-white hover:bg-green-700`}>{spin("APPROVE")} Approve &amp; publish</button>
            <button type="button" disabled={Boolean(busy)} onClick={() => decide("REQUEST_CHANGES")} className={`${btn} border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100`}>{spin("REQUEST_CHANGES")} Request changes</button>
            <button type="button" disabled={Boolean(busy)} onClick={() => decide("REJECT")} className={`${btn} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}>{spin("REJECT")} Reject</button>
          </>
        ) : (
          <button type="button" disabled={Boolean(busy)} onClick={() => decide("REVOKE")} className={`${btn} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}>{spin("REVOKE")} Remove verification</button>
        )}
      </div>
      {canDecide && verified ? (
        <p className="mt-3 text-xs text-app-muted">This mentor is already live. "Request changes" keeps their current profile visible; "Reject" hides it.</p>
      ) : null}
    </Panel>
  );
}
