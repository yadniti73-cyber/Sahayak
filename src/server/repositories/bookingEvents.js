import { BookingEvent } from "@/server/models/bookingEvent";

export async function createBookingEvent(data) {
  const event = new BookingEvent(data);
  return event.save();
}

export async function findEventsForBooking(bookingId) {
  return BookingEvent.find({ bookingId }).sort({ createdAt: -1 }).lean();
}
