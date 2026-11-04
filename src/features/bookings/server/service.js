import { z } from "zod";
import { connectMongo } from "@/server/db/mongo";
import { findMentorById } from "@/server/repositories/mentorProfiles";
import { findUserById } from "@/server/repositories/users";
import { createBooking, findBookingById, findBookingsForUser, updateBooking } from "@/server/repositories/bookings";
import { createBookingEvent } from "@/server/repositories/bookingEvents";
import { createNotification } from "@/server/repositories/notifications";
import { DEFAULT_TZ, formatDayLabel, formatTimeOnly, fullName } from "@/server/dashboard/view-models";

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
  action: z.enum(["CONFIRM", "REJECT", "CANCEL", "COMPLETE", "RESCHEDULE_REQUEST", "SCHEDULE_LATER", "NO_SHOW"]),
  startAtUtc: z.string().optional(),
  endAtUtc: z.string().optional(),
  // Optional note from the mentor, included in the notification sent to the seeker.
  message: z.string().max(500).optional(),
});

// Notifications are best-effort: a failure here must never undo the booking change itself.
async function notify(userId, payload) {
  try {
    await createNotification({ userId, ...payload });
  } catch (error) {
    console.error("booking notification failed", error);
  }
}

function whenLabel(booking, tz) {
  return `${formatDayLabel(booking.startAtUtc, tz)} at ${formatTimeOnly(booking.startAtUtc, tz)}`;
}

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

  const seeker = await findUserById(seekerId);
  await notify(mentor._id, {
    title: "New guidance request",
    message: `${fullName(seeker) || "A seeker"} requested a session on ${whenLabel(booking, booking.mentorTimezone || DEFAULT_TZ)}.`,
    link: "/mentor/bookings",
  });
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
      if (!isMentor || !["REQUESTED", "RESCHEDULE_REQUESTED"].includes(booking.status)) {
        throw new Error("Only mentors can confirm a requested booking.");
      }
      updates.status = "CONFIRMED";
      eventType = "CONFIRMED";
      break;
    case "REJECT":
      if (!isMentor || !["REQUESTED", "RESCHEDULE_REQUESTED"].includes(booking.status)) {
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
    case "SCHEDULE_LATER": {
      // Mentor can't confirm right now: keep the request open, optionally proposing a different time.
      if (!isMentor || !["REQUESTED", "RESCHEDULE_REQUESTED"].includes(booking.status)) {
        throw new Error("Only mentors can reschedule a pending request.");
      }
      updates.status = "RESCHEDULE_REQUESTED";
      if (parsed.startAtUtc) {
        const newStart = new Date(parsed.startAtUtc);
        if (Number.isNaN(newStart.getTime()) || newStart <= new Date()) {
          throw new Error("Please pick a time in the future.");
        }
        const duration = new Date(booking.endAtUtc).getTime() - new Date(booking.startAtUtc).getTime();
        updates.startAtUtc = newStart;
        updates.endAtUtc = new Date(newStart.getTime() + (duration > 0 ? duration : 60 * 60 * 1000));
      }
      eventType = "RESCHEDULE_REQUESTED";
      break;
    }
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

  let updatedBooking;
  try {
    updatedBooking = await updateBooking(bookingId, updates);
  } catch (error) {
    // Unique index: one CONFIRMED booking per mentor per start time.
    if (error?.code === 11000) throw new Error("You already have a confirmed session at this time.");
    throw error;
  }
  await createBookingEvent({
    bookingId: updatedBooking._id,
    actorId: userId,
    type: eventType,
    data: { action, message: parsed.message || "" },
  });

  await notifyAboutBookingChange({ before: booking, after: updatedBooking, action, isMentor, message: parsed.message });
  return updatedBooking;
}


// Tells the other party what happened. Mentors' decisions go to the seeker; seekers' changes go to the mentor.
async function notifyAboutBookingChange({ before, after, action, isMentor, message }) {
  const [mentor, seeker] = await Promise.all([findUserById(after.mentorId), findUserById(after.seekerId)]);
  const mentorName = fullName(mentor) || "Your mentor";
  const seekerName = fullName(seeker) || "The seeker";
  const seekerTz = after.seekerTimezoneAtBooking || DEFAULT_TZ;
  const note = message?.trim() ? ` "${message.trim()}"` : "";
  const toSeeker = (title, text) => notify(after.seekerId, { title, message: text, link: "/dashboard/bookings" });
  const toMentor = (title, text) => notify(after.mentorId, { title, message: text, link: "/mentor/bookings" });

  switch (action) {
    case "CONFIRM":
      return toSeeker("Session confirmed", `${mentorName} approved your request for ${whenLabel(after, seekerTz)}.${note}`);
    case "REJECT":
      return toSeeker("Request declined", `${mentorName} couldn't take your request for ${whenLabel(before, seekerTz)}.${note}`);
    case "SCHEDULE_LATER": {
      const moved = new Date(before.startAtUtc).getTime() !== new Date(after.startAtUtc).getTime();
      return moved
        ? toSeeker("New time suggested", `${mentorName} suggested ${whenLabel(after, seekerTz)} instead of ${whenLabel(before, seekerTz)}.${note}`)
        : toSeeker("Mentor will schedule later", `${mentorName} can't confirm ${whenLabel(before, seekerTz)} yet and will get back to you with a time.${note}`);
    }
    case "COMPLETE":
      return toSeeker("Session completed", `Your session with ${mentorName} on ${whenLabel(after, seekerTz)} is marked completed.`);
    case "NO_SHOW":
      return toSeeker("Session marked as no-show", `${mentorName} marked your session on ${whenLabel(after, seekerTz)} as a no-show.`);
    case "CANCEL":
      return isMentor
        ? toSeeker("Session cancelled", `${mentorName} cancelled your session on ${whenLabel(after, seekerTz)}.${note}`)
        : toMentor("Session cancelled", `${seekerName} cancelled the session on ${whenLabel(after, after.mentorTimezone || DEFAULT_TZ)}.`);
    case "RESCHEDULE_REQUEST":
      return toMentor("Reschedule requested", `${seekerName} asked to move the session to ${whenLabel(after, after.mentorTimezone || DEFAULT_TZ)}.`);
    default:
      return null;
  }
}
