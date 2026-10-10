// Save as: app/api/feedback/route.js
// Minimal handler so the form works end-to-end. Replace the TODO with your
// database insert or email service.
import { NextResponse } from "next/server";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, topic, message, rating } = body || {};
  if (!name || !/^\S+@\S+\.\S+$/.test(email || "") || !message || message.length < 10 || !(rating >= 1 && rating <= 5)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }

  // TODO: persist (e.g. Prisma/Mongo/Supabase) or send an email notification.
  console.log("[feedback]", { name, email, topic, rating, message });

  return NextResponse.json({ ok: true });
}
