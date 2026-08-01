import mongoose from "mongoose";

const BookingEventSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    type: {
      type: String,
      enum: [
        "REQUESTED",
        "CONFIRMED",
        "REJECTED",
        "CANCELLED",
        "COMPLETED",
        "RESCHEDULE_REQUESTED",
        "NO_SHOW",
        "REMINDER_SENT",
        "REVIEW_SUBMITTED",
      ],
      required: true,
    },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: false,
    collection: "bookingEvents",
  }
);

BookingEventSchema.index({ bookingId: 1 });
BookingEventSchema.index({ type: 1 });

export const BookingEvent = mongoose.models.BookingEvent || mongoose.model("BookingEvent", BookingEventSchema);
