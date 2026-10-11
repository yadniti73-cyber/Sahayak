import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    seekerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: "MentorProfile", required: true },
    status: {
      type: String,
      enum: [
        "REQUESTED",
        "CONFIRMED",
        "REJECTED",
        "CANCELLED",
        "COMPLETED",
        "RESCHEDULE_REQUESTED",
        "NO_SHOW",
        "CLOSED",
      ],
      default: "REQUESTED",
      required: true,
    },
    mode: {
      type: String,
      enum: ["VIDEO", "PHONE", "IN_PERSON"],
      default: "VIDEO",
      required: true,
    },
    startAtUtc: { type: Date, required: true },
    endAtUtc: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return !this.startAtUtc || value > this.startAtUtc;
        },
        message: "endAtUtc must be after startAtUtc.",
      },
    },
    mentorTimezone: { type: String, default: "" },
    seekerTimezoneAtBooking: { type: String, default: "" },
    notes: { type: String, default: "" },
    price: { type: String, default: "" },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: true,
    collection: "bookings",
  }
);

BookingSchema.index({ seekerId: 1 });
BookingSchema.index({ mentorId: 1 });
BookingSchema.index({ mentorProfileId: 1 });
BookingSchema.index({ status: 1 });
// A mentor can have only one CONFIRMED booking at the same start time.
BookingSchema.index(
  { mentorId: 1, startAtUtc: 1 },
  { unique: true, partialFilterExpression: { status: "CONFIRMED" } }
);

export const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
