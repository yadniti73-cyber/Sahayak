import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { getBookingDetails, updateBookingWorkflow } from "@/features/bookings/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const user = await requireAuth();
    const booking = await getBookingDetails(id, user.id, user.role);
    return NextResponse.json(successResponse({ booking }, "Booking loaded."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to load booking."), { status: error.message === "Unauthorized" ? 401 : 400 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const user = await requireAuth();
    const payload = await request.json();
    const booking = await updateBookingWorkflow(id, user.id, user.role, payload);
    return NextResponse.json(successResponse({ booking }, "Booking updated."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to update booking."), { status: error.message === "Unauthorized" ? 401 : 400 });
  }
}
