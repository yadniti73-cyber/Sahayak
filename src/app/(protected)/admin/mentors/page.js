import Link from "next/link";
import { DashboardShell, Badge, EmptyState, Panel, SectionHeading } from "@/components";
import { ADMIN_FILTERS, listMentorApplications } from "@/features/mentor-verification/server/service";
import { STATUS_META } from "@/features/mentor-verification/constants";
import { requirePageAccess } from "@/server/auth/route-guards";

export const dynamic = "force-dynamic";

const TAB_LABELS = {
  SUBMITTED: "Needs review",
  CHANGES_REQUESTED: "Changes requested",
  APPROVED: "Verified",
  REJECTED: "Rejected",
  DRAFT: "Not submitted",
};

const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");

export default async function AdminMentorsPage({ searchParams }) {
  await requirePageAccess(["ADMIN"]);
  const params = await searchParams;
  const status = ADMIN_FILTERS.includes(params?.status) ? params.status : "SUBMITTED";
  const { counts, rows } = await listMentorApplications({ status });

  return (
    <DashboardShell role="admin" title="Mentors">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Verification"
          title="Review mentor applications"
          description="Open an application to read the details, check the documents, and approve, request changes or reject. Only approved mentors are visible to seekers."
        />

        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          {ADMIN_FILTERS.map((s) => (
            <Link
              key={s}
              href={`/admin/mentors?status=${s}`}
              aria-current={s === status ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                s === status ? "border-app-primary bg-app-primary text-white" : "border-app-border bg-white text-app-text hover:border-green-500"
              }`}
            >
              {TAB_LABELS[s]}
              <span className={`rounded-full px-2 text-xs ${s === status ? "bg-white/20" : "bg-slate-100"}`}>{counts[s]}</span>
            </Link>
          ))}
        </nav>

        {rows.length === 0 ? (
          <EmptyState title={`Nothing in "${TAB_LABELS[status]}"`} description="Mentors will appear here as their applications move through verification." />
        ) : (
          <div className="grid gap-3">
            {rows.map((m) => (
              <Link key={m.id} href={`/admin/mentors/${m.id}`} className="block">
                <Panel className="transition hover:-translate-y-0.5 hover:shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-semibold">{m.name}</h2>
                      <p className="mt-1 text-sm text-app-muted">{m.email}</p>
                      {m.headline ? <p className="mt-1 text-sm text-app-muted">{m.headline}</p> : null}
                      <p className="mt-2 text-xs text-app-muted">
                        {[m.category, m.city, m.submittedAt ? `Submitted ${fmt(m.submittedAt)}` : ""].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {m.listed ? <Badge tone="green">Live on portal</Badge> : null}
                      <Badge tone={STATUS_META[m.status].tone}>{STATUS_META[m.status].label}</Badge>
                    </div>
                  </div>
                </Panel>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
