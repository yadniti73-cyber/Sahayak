import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { getNotifications } from "@/features/notifications/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function GET(request) {
  try {
    const user = await requireAuth();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || 50);
    const offset = Number(url.searchParams.get("offset") || 0);
    const items = await getNotifications(user.id, { limit, offset });
    return NextResponse.json(successResponse({ notifications: items }, "Notifications loaded."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to load notifications."), { status: error.message === "Unauthorized" ? 401 : 400 });
  }
}
