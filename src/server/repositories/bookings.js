import { Booking } from "@/server/models/booking";

export async function createBooking(data) {
  const booking = new Booking(data);
  return booking.save();
}

export async function findBookingById(id) {
  return Booking.findById(id).lean();
}

export async function findBookingsForSeeker(seekerId, { limit = 20, offset = 0 } = {}) {
  return Booking.find({ seekerId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();
}

export async function findBookingsForMentor(mentorId, { limit = 20, offset = 0 } = {}) {
  return Booking.find({ mentorId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();
}

export async function updateBooking(id, updates) {
  return Booking.findByIdAndUpdate(id, updates, { new: true }).lean();
}

export async function findBookingsForUser(userId, role, { limit = 20, offset = 0 } = {}) {
  const query = role === "MENTOR" ? { mentorId: userId } : { seekerId: userId };
  return Booking.find(query).sort({ createdAt: -1 }).skip(offset).limit(limit).lean();
}
