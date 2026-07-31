import { DashboardShell, ButtonLink, SectionHeading } from "@/components";
import { BookingCard } from "@/components/domain-cards";
import { bookings } from "@/lib/frontend-data";

export default function MentorBookingsPage() {
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
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.topic} booking={booking} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
