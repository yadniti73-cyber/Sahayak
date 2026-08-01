import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { getBookingDetails, updateBookingWorkflow } from "@/features/bookings/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function GET({ params }) {
  try {
    const user = await requireAuth();
    const booking = await getBookingDetails(params.id, user.id, user.role);
    return NextResponse.json(successResponse({ booking }, "Booking loaded."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to load booking."), { status: error.message === "Unauthorized" ? 401 : 400 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await requireAuth();
    const payload = await request.json();
    const booking = await updateBookingWorkflow(params.id, user.id, user.role, payload);
    return NextResponse.json(successResponse({ booking }, "Booking updated."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to update booking."), { status: 400 });
  }
}
