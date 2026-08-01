import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { markNotificationAsRead } from "@/features/notifications/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function PATCH({ params }) {
  try {
    await requireAuth();
    const notification = await markNotificationAsRead(params.id);
    if (!notification) {
      return NextResponse.json(errorResponse("Notification not found."), { status: 404 });
    }
    return NextResponse.json(successResponse({ notification }, "Notification marked as read."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to update notification."), { status: error.message === "Unauthorized" ? 401 : 400 });
  }
}
