import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/guards";
import { connectMongo } from "@/server/db/mongo";
import { listFeedback } from "@/server/repositories/feedback";
import { successResponse } from "@/server/utils/api-response";
import { handleRouteError } from "@/server/utils/route-helpers";

export async function GET() {
  try {
    await requireRole("ADMIN");
    await connectMongo();
    const records = await listFeedback();
    const rows = records.map((item) => ({
      id: String(item._id),
      name: item.name,
      email: item.email,
      topic: item.topic || "General",
      message: item.message,
      rating: item.rating ?? null,
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
    }));
    return NextResponse.json(successResponse({ feedback: rows, total: rows.length }));
  } catch (error) {
    return handleRouteError(error, "Unable to load feedback.");
  }
}
