import { DashboardShell, ButtonLink, SectionHeading } from "@/components";
import { BookingCard } from "@/components/domain-cards";
import { bookings } from "@/lib/frontend-data";

export default function SeekerBookingsPage() {
  return (
    <DashboardShell role="seeker" title="Bookings">
      <div className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Bookings"
            title="Manage your guidance sessions"
            description="Track requested, confirmed, completed, and cancelled mentorship sessions."
          />
          <ButtonLink href="/mentors">Book new session</ButtonLink>
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
