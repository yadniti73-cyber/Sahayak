 "use client";

import { useState } from "react";

const ROLES = ["SEEKER", "MENTOR", "ADMIN"];

export function AdminUsersTable({ initialRows }) {
  const [rows, setRows] = useState(initialRows);
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState("");

  async function changeRole(user, role) {
    if (role === user.role) return;
    const confirmed = window.confirm(`Change ${user.name || user.email}'s role from ${user.role} to ${role}?`);
    if (!confirmed) return;
    setBusyId(user.id);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Unable to update role.");
      setRows((current) => current.map((item) => item.id === user.id ? { ...item, role } : item));
      setNotice(`${user.name || user.email} is now ${role}.`);
    } catch (error) {
      setNotice(error.message || "Unable to update role.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="grid gap-3">
      {notice ? <p role="status" className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-app-primary">{notice}</p> : null}
      <div className="overflow-x-auto rounded-2xl border border-app-border bg-white shadow-sm">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-gradient-to-r from-blue-50 to-green-50 text-xs uppercase tracking-wide text-app-muted">
            <tr>
              {["User", "Email", "Role", "Status", "Joined", "Manage role"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border">
            {rows.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50/60">
                <td className="px-4 py-3 font-semibold text-app-text">{user.name || "(no name)"}</td>
                <td className="px-4 py-3 text-app-muted">{user.email}</td>
                <td className="px-4 py-3"><span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-app-primary">{user.role}</span></td>
                <td className="px-4 py-3 text-app-muted">{user.status}</td>
                <td className="px-4 py-3 text-app-muted">{user.joined}</td>
                <td className="px-4 py-3">
                  <select
                    aria-label={`Change role for ${user.email}`}
                    className="app-input min-w-32 !px-2 !py-2 text-xs"
                    value={user.role}
                    disabled={busyId === user.id || user.status !== "ACTIVE"}
                    onChange={(event) => changeRole(user, event.target.value)}
                  >
                    {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                  {busyId === user.id ? <span className="ml-2 text-xs text-app-muted">Saving…</span> : null}
                </td>
              </tr>
            ))}
            {rows.length === 0 ? <tr><td colSpan={6} className="px-4 py-10 text-center text-app-muted">No users yet.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
