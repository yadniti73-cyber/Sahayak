import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/guards";
import { connectMongo } from "@/server/db/mongo";
import { deleteFeedbackById } from "@/server/repositories/feedback";
import { successResponse } from "@/server/utils/api-response";
import { handleRouteError } from "@/server/utils/route-helpers";

export async function DELETE(_request, context) {
  try {
    await requireRole("ADMIN");
    await connectMongo();
    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Feedback not found." }, { status: 404 });
    }

    const deleted = await deleteFeedbackById(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Feedback not found." }, { status: 404 });
    }

    return NextResponse.json(successResponse({}, "Feedback deleted."));
  } catch (error) {
    return handleRouteError(error, "Unable to delete feedback.");
  }
}
