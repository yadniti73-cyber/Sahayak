import { z } from "zod";
import { connectMongo } from "@/server/db/mongo";
import { findMentorById } from "@/server/repositories/mentorProfiles";
import { findUserById } from "@/server/repositories/users";
import { createBooking, findBookingById, findBookingsForUser, updateBooking } from "@/server/repositories/bookings";
import { createBookingEvent } from "@/server/repositories/bookingEvents";

const createBookingSchema = z.object({
  mentorProfileId: z.string().min(1),
  startAtUtc: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid date.",
  }),
  endAtUtc: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid date.",
  }),
  mode: z.enum(["VIDEO", "PHONE", "IN_PERSON"]).default("VIDEO"),
  notes: z.string().optional(),
  price: z.string().optional(),
  mentorTimezone: z.string().optional(),
  seekerTimezoneAtBooking: z.string().optional(),
});

const updateBookingSchema = z.object({
  action: z.enum(["CONFIRM", "REJECT", "CANCEL", "COMPLETE", "RESCHEDULE_REQUEST", "NO_SHOW"]),
  startAtUtc: z.string().optional(),
  endAtUtc: z.string().optional(),
});

export async function createBookingRequest(seekerId, payload) {
  const parsed = createBookingSchema.parse(payload);
  await connectMongo();

  const mentorProfile = await findMentorById(parsed.mentorProfileId);
  if (!mentorProfile || !mentorProfile.active || !mentorProfile.verified) {
    throw new Error("Mentor not found.");
  }

  const mentor = await findUserById(mentorProfile.userId);
  if (!mentor || mentor.role !== "MENTOR") {
    throw new Error("Mentor not found.");
  }

  const startAt = new Date(parsed.startAtUtc);
  const endAt = new Date(parsed.endAtUtc);
  if (startAt >= endAt) {
    throw new Error("The end time must be after the start time.");
  }

  const booking = await createBooking({
    seekerId,
    mentorId: mentor._id,
    mentorProfileId: mentorProfile._id,
    startAtUtc: startAt,
    endAtUtc: endAt,
    mentorTimezone: parsed.mentorTimezone || "",
    seekerTimezoneAtBooking: parsed.seekerTimezoneAtBooking || "",
    mode: parsed.mode,
    notes: parsed.notes || "",
    price: parsed.price || "",
  });

  await createBookingEvent({ bookingId: booking._id, type: "REQUESTED", actorId: seekerId, data: { notes: booking.notes } });
  return booking;
}

export async function getBookingsForViewer(userId, role, { limit = 20, offset = 0 } = {}) {
  await connectMongo();
  return findBookingsForUser(userId, role, { limit, offset });
}

export async function getBookingDetails(bookingId, userId, role) {
  await connectMongo();
  const booking = await findBookingById(bookingId);
  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (role === "MENTOR" && booking.mentorId.toString() !== userId) {
    throw new Error("Not authorized to view this booking.");
  }
  if (role !== "MENTOR" && booking.seekerId.toString() !== userId) {
    throw new Error("Not authorized to view this booking.");
  }

  return booking;
}

export async function updateBookingWorkflow(bookingId, userId, role, payload) {
  const parsed = updateBookingSchema.parse(payload);
  await connectMongo();

  const booking = await findBookingById(bookingId);
  if (!booking) {
    throw new Error("Booking not found.");
  }

  const isMentor = role === "MENTOR" && booking.mentorId.toString() === userId;
  const isSeeker = booking.seekerId.toString() === userId;
  if (!isMentor && !isSeeker) {
    throw new Error("Not authorized to update this booking.");
  }

  const action = parsed.action;
  const updates = {};
  let eventType = null;

  switch (action) {
    case "CONFIRM":
      if (!isMentor || booking.status !== "REQUESTED") {
        throw new Error("Only mentors can confirm a requested booking.");
      }
      updates.status = "CONFIRMED";
      eventType = "CONFIRMED";
      break;
    case "REJECT":
      if (!isMentor || booking.status !== "REQUESTED") {
        throw new Error("Only mentors can reject a requested booking.");
      }
      updates.status = "REJECTED";
      eventType = "REJECTED";
      break;
    case "CANCEL":
      if (!isSeeker && !isMentor) {
        throw new Error("Not authorized to cancel this booking.");
      }
      if (["CANCELLED", "REJECTED", "COMPLETED", "NO_SHOW", "CLOSED"].includes(booking.status)) {
        throw new Error("This booking cannot be cancelled.");
      }
      updates.status = "CANCELLED";
      eventType = "CANCELLED";
      break;
    case "COMPLETE":
      if (!isMentor || booking.status !== "CONFIRMED") {
        throw new Error("Only mentors can complete a confirmed booking.");
      }
      updates.status = "COMPLETED";
      eventType = "COMPLETED";
      break;
    case "RESCHEDULE_REQUEST":
      if (!isSeeker || !["REQUESTED", "CONFIRMED"].includes(booking.status)) {
        throw new Error("Only seekers can request a reschedule for an active booking.");
      }
      if (!parsed.startAtUtc || !parsed.endAtUtc) {
        throw new Error("Reschedule requires a new start and end time.");
      }
      const startAt = new Date(parsed.startAtUtc);
      const endAt = new Date(parsed.endAtUtc);
      if (startAt >= endAt) {
        throw new Error("The end time must be after the start time.");
      }
      updates.status = "RESCHEDULE_REQUESTED";
      updates.startAtUtc = startAt;
      updates.endAtUtc = endAt;
      eventType = "RESCHEDULE_REQUESTED";
      break;
    case "NO_SHOW":
      if (!isMentor || booking.status !== "CONFIRMED") {
        throw new Error("Only mentors can mark a confirmed booking as no-show.");
      }
      updates.status = "NO_SHOW";
      eventType = "NO_SHOW";
      break;
    default:
      throw new Error("Invalid booking action.");
  }

  const updatedBooking = await updateBooking(bookingId, updates);
  await createBookingEvent({ bookingId: updatedBooking._id, actorId: userId, type: eventType, data: { action } });
  return updatedBooking;
}
