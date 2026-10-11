import { DashboardShell, ButtonLink, EmptyState, SectionHeading } from "@/components";
import { BookingCard } from "@/components/domain-cards";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getBookingViewsForUser } from "@/server/dashboard/queries";

export default async function MentorBookingsPage() {
  const user = await requirePageAccess(["MENTOR"]);
  const bookings = await getBookingViewsForUser(user.id, "MENTOR");

  return (
    <DashboardShell role="mentor" title="Booking requests">
      <div className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Requests"
            title="Review seeker requests"
            description="Accept, reject, or suggest a reschedule. Completed bookings become read-only."
          />
          <ButtonLink href="/mentor/availability" variant="secondary">Update availability</ButtonLink>
        </div>
        {bookings.length === 0 ? (
          <EmptyState title="No booking requests yet" description="Requests from seekers will appear here as soon as they come in." />
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
