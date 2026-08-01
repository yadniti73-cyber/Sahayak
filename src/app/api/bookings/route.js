import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { createBookingRequest, getBookingsForViewer } from "@/features/bookings/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function GET(request) {
  try {
    const user = await requireAuth();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || 20);
    const offset = Number(url.searchParams.get("offset") || 0);
    const bookings = await getBookingsForViewer(user.id, user.role, { limit, offset });
    return NextResponse.json(successResponse({ bookings }, "Bookings loaded."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to load bookings."), { status: error.message === "Unauthorized" ? 401 : 400 });
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth();
    const payload = await request.json();
    const booking = await createBookingRequest(user.id, payload);
    return NextResponse.json(successResponse({ booking }, "Booking request created."), { status: 201 });
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to create booking."), { status: 400 });
  }
}
