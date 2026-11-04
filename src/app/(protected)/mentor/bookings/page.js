import { DashboardShell, ButtonLink, EmptyState, SectionHeading } from "@/components";
import { MentorBookingRequests } from "@/components/MentorBookingRequests";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getMentorBookingItems } from "@/server/dashboard/queries";

export const dynamic = "force-dynamic";

export default async function MentorBookingsPage() {
  const user = await requirePageAccess(["MENTOR"]);
  const items = await getMentorBookingItems(user.id, { limit: 100, sort: -1 });

  return (
    <DashboardShell role="mentor" title="Booking requests">
      <div className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Requests"
            title="Review seeker requests"
            description="Approve, reject, or schedule later. The seeker is notified of every decision."
          />
          <ButtonLink href="/mentor/availability" variant="secondary">Update availability</ButtonLink>
        </div>
        {items.length === 0 ? (
          <EmptyState title="No booking requests yet" description="Requests from seekers will appear here as soon as they come in." />
        ) : (
          <MentorBookingRequests items={items} />
        )}
      </div>
    </DashboardShell>
  );
}
