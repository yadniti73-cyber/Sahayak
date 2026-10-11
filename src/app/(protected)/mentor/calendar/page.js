import { DashboardShell, Badge, EmptyState, Panel, SectionHeading } from "@/components";
import { statusInfo } from "@/components/domain-cards";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getMentorUpcomingBookings } from "@/server/dashboard/queries";

export default async function MentorCalendarPage() {
  const user = await requirePageAccess(["MENTOR"]);
  const sessions = await getMentorUpcomingBookings(user.id);

  return (
    <DashboardShell role="mentor" title="Calendar">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Calendar"
          title="Your upcoming sessions"
          description="Confirmed sessions and pending requests, soonest first."
        />
        {sessions.length === 0 ? (
          <EmptyState title="Nothing scheduled" description="Confirmed sessions and pending requests will show up here." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((s) => {
              const [label, tone] = statusInfo(s.status);
              return (
                <Panel key={s.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-app-primary">{s.date} at {s.time}</p>
                      <h2 className="mt-2 font-bold">{s.topic}</h2>
                      <p className="mt-1 text-sm text-app-muted">{s.mentor}</p>
                    </div>
                    <Badge tone={tone}>{label}</Badge>
                  </div>
                </Panel>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
