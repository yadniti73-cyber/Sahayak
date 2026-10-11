import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const { name, email, topic, message } = body || {};

  if (!name || !email || !message || message.length > 1000 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  // TODO: save to your database or send an email. Logging is only a placeholder.
  console.log("contact", { name, email, topic, message });

  return NextResponse.json({ ok: true });
}
