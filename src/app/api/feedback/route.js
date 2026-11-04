import { NextResponse } from "next/server";
import { connectMongo } from "@/server/db/mongo";
import { createFeedback } from "@/server/repositories/feedback";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON." }, { status: 400 });
  }

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const topic = typeof body?.topic === "string" ? body.topic.trim().slice(0, 80) : "General";
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const rating = body?.rating === "" || body?.rating == null ? null : Number(body.rating);

  if (!name || name.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 ||
      message.length < 10 || message.length > 5000 ||
      (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5))) {
    return NextResponse.json({ success: false, message: "Please check your feedback details." }, { status: 422 });
  }

  try {
    await connectMongo();
    await createFeedback({ name, email, topic, message, rating });
    return NextResponse.json({ success: true, message: "Feedback received." }, { status: 201 });
  } catch (error) {
    console.error("[feedback] Unable to save submission:", error);
    return NextResponse.json({ success: false, message: "Unable to save feedback right now." }, { status: 500 });
  }
}
