import { DashboardShell, SectionHeading } from "@/components";
import { BookingCard } from "@/components/domain-cards";
import { bookings } from "@/lib/frontend-data";

export default function AdminBookingsPage() {
  return (
    <DashboardShell role="admin" title="Bookings">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Booking oversight"
          title="Monitor the lifecycle of guidance sessions"
          description="Admins can inspect requested, confirmed, cancelled, completed, and reported bookings."
        />
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.topic} booking={booking} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
