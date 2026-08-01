import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { markAllNotificationsRead } from "@/features/notifications/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function PATCH() {
  try {
    const user = await requireAuth();
    await markAllNotificationsRead(user.id);
    return NextResponse.json(successResponse({}, "All notifications marked as read."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to update notifications."), { status: error.message === "Unauthorized" ? 401 : 400 });
  }
}
