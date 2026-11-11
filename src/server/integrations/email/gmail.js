import nodemailer from "nodemailer";

// Email sender.
//   Production (Render): set BREVO_API_KEY  -> sends over HTTPS (port 443). Render blocks SMTP ports on free services.
//   Local dev fallback : GMAIL_USER + GMAIL_APP_PASSWORD -> Gmail SMTP.
// File name kept as gmail.js so existing imports keep working.

let cachedTransporter;

function getGmail() {
  const user = process.env.GMAIL_USER?.trim();
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !password) return null;
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass: password },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }
  return { transporter: cachedTransporter, user };
}

function fromIdentity() {
  const name = process.env.EMAIL_FROM_NAME?.trim() || process.env.GMAIL_FROM_NAME?.trim() || "GuideShala";
  const address = process.env.EMAIL_FROM?.trim() || process.env.GMAIL_USER?.trim();
  return { name, address };
}

async function sendViaBrevo({ to, toName, subject, text, html, replyTo }) {
  const apiKey = process.env.BREVO_API_KEY.trim();
  const from = fromIdentity();
  if (!from.address) {
    const error = new Error("Set EMAIL_FROM to a sender address verified in Brevo.");
    error.status = 503;
    throw error;
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { name: from.name, email: from.address },
      to: [{ email: to, ...(toName ? { name: toName } : {}) }],
      subject,
      htmlContent: html,
      textContent: text,
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const error = new Error(`Brevo send failed (${res.status}): ${data?.message || res.statusText}`);
    error.status = 503;
    throw error;
  }
  return res.json().catch(() => ({}));
}

async function deliver({ to, toName, subject, text, html, replyTo }) {
  if (process.env.BREVO_API_KEY?.trim()) {
    return sendViaBrevo({ to, toName, subject, text, html, replyTo });
  }
  const gmail = getGmail();
  if (!gmail) {
    const error = new Error("Email is not configured. Set BREVO_API_KEY + EMAIL_FROM (production) or GMAIL_USER + GMAIL_APP_PASSWORD (local).");
    error.status = 503;
    throw error;
  }
  const from = fromIdentity();
  return gmail.transporter.sendMail({
    from: { name: from.name, address: gmail.user },
    to,
    replyTo: replyTo || gmail.user,
    subject,
    text,
    html,
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendFeedbackReply({ recipient, recipientName, message, originalMessage }) {
  const safeName = escapeHtml(recipientName || "there");
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br>");
  const safeOriginal = escapeHtml(originalMessage).replaceAll("\n", "<br>");
  const fromName = fromIdentity().name === "GuideShala" ? "GuideShala Support" : fromIdentity().name;
  const replyTo = process.env.EMAIL_REPLY_TO?.trim() || process.env.EMAIL_FROM?.trim() || process.env.GMAIL_USER?.trim();

  return deliver({
    to: recipient,
    toName: recipientName,
    replyTo,
    subject: "Reply to your GuideShala feedback",
    text: `Hello ${recipientName || "there"},\n\n${message}\n\nYour original feedback:\n${originalMessage}\n\nRegards,\n${fromName}`,
    html: `<!doctype html><html><body style="margin:0;padding:24px;background:#f3f7fb;font-family:Arial,sans-serif;color:#172554"><div style="max-width:640px;margin:0 auto;padding:28px;background:#fff;border:1px solid #dbeafe;border-radius:16px"><h2 style="margin:0 0 18px;color:#1d4ed8">GuideShala Support</h2><p>Hello ${safeName},</p><div style="font-size:15px;line-height:1.7">${safeMessage}</div><div style="margin-top:24px;padding:16px;border-left:3px solid #16a34a;background:#f0fdf4;color:#475569"><strong>Your original feedback</strong><p style="margin:8px 0 0;line-height:1.6">${safeOriginal}</p></div><p style="margin:24px 0 0">Regards,<br>${escapeHtml(fromName)}</p></div></body></html>`,
  });
}

export async function sendOtpEmail({ recipient, recipientName, code, minutes = 10 }) {
  const safeName = escapeHtml(recipientName || "there");
  const fromName = fromIdentity().name;

  return deliver({
    to: recipient,
    toName: recipientName,
    subject: `${code} is your GuideShala verification code`,
    text: `Hello ${recipientName || "there"},\n\nYour GuideShala verification code is ${code}.\nIt expires in ${minutes} minutes. If you didn't request it, you can ignore this email.\n\n${fromName}`,
    html: `<!doctype html><html><body style="margin:0;padding:24px;background:#f3f7fb;font-family:Arial,sans-serif;color:#172554"><div style="max-width:480px;margin:0 auto;padding:28px;background:#fff;border:1px solid #dbeafe;border-radius:16px"><h2 style="margin:0 0 16px;color:#1d4ed8">GuideShala</h2><p>Hello ${safeName},</p><p>Use this code to verify your email:</p><p style="margin:20px 0;padding:14px;text-align:center;font-size:32px;font-weight:700;letter-spacing:8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;color:#166534">${escapeHtml(code)}</p><p style="color:#475569;font-size:14px">This code expires in ${minutes} minutes. If you didn't request it, you can safely ignore this email.</p></div></body></html>`,
  });
}
