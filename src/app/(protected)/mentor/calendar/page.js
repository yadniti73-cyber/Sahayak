import { DashboardShell, Badge, Panel, SectionHeading } from "@/components";

const slots = [
  ["Mon", "10:00 AM", "Career planning", "Confirmed"],
  ["Tue", "4:00 PM", "Pitch review", "Requested"],
  ["Wed", "6:30 PM", "Research roadmap", "Confirmed"],
  ["Fri", "5:00 PM", "Open guidance slot", "Open"],
];

export default function MentorCalendarPage() {
  return (
    <DashboardShell role="mentor" title="Calendar">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Calendar"
          title="Your week at a glance"
          description="A lightweight schedule view for confirmed sessions, pending requests, and open slots."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {slots.map(([day, time, title, status]) => (
            <Panel key={`${day}-${time}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-app-primary">{day} at {time}</p>
                  <h2 className="mt-2 font-bold">{title}</h2>
                </div>
                <Badge tone={status === "Open" ? "gray" : status === "Requested" ? "amber" : "green"}>{status}</Badge>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
