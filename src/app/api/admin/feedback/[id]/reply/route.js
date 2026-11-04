import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/guards";
import { connectMongo } from "@/server/db/mongo";
import { findFeedbackById } from "@/server/repositories/feedback";
import { sendFeedbackReply } from "@/server/integrations/email/gmail";
import { successResponse } from "@/server/utils/api-response";
import { handleRouteError } from "@/server/utils/route-helpers";

export const runtime = "nodejs";

export async function POST(request, context) {
  try {
    await requireRole("ADMIN");
    await connectMongo();

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Feedback not found." }, { status: 404 });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
    }

    const message = typeof payload?.message === "string" ? payload.message.trim() : "";
    if (!message || message.length > 10000) {
      return NextResponse.json({ success: false, message: "Reply must contain between 1 and 10,000 characters." }, { status: 422 });
    }

    const feedback = await findFeedbackById(id);
    if (!feedback) {
      return NextResponse.json({ success: false, message: "Feedback not found." }, { status: 404 });
    }
    if (!feedback.email || !/^\S+@\S+\.\S+$/.test(feedback.email)) {
      return NextResponse.json({ success: false, message: "This feedback record has no valid recipient email address." }, { status: 422 });
    }

    await sendFeedbackReply({
      recipient: feedback.email,
      recipientName: feedback.name,
      message,
      originalMessage: feedback.message,
    });

    return NextResponse.json(successResponse({ recipient: feedback.email }, "Reply sent successfully."));
  } catch (error) {
    return handleRouteError(error, "Unable to send the feedback reply. Check the Gmail configuration and try again.");
  }
}
