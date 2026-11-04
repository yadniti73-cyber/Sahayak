import nodemailer from "nodemailer";

let cachedTransporter;

function getTransporter() {
  const user = process.env.GMAIL_USER?.trim();
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");

  if (!user || !password) {
    const error = new Error("Gmail sending is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.");
    error.status = 503;
    throw error;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass: password },
    });
  }

  return { transporter: cachedTransporter, user };
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
  const { transporter, user } = getTransporter();
  const safeName = escapeHtml(recipientName || "there");
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br>");
  const safeOriginal = escapeHtml(originalMessage).replaceAll("\n", "<br>");
  const fromName = process.env.GMAIL_FROM_NAME?.trim() || "GuideShala Support";

  return transporter.sendMail({
    from: { name: fromName, address: user },
    to: recipient,
    replyTo: user,
    subject: "Reply to your GuideShala feedback",
    text: `Hello ${recipientName || "there"},\n\n${message}\n\nYour original feedback:\n${originalMessage}\n\nRegards,\n${fromName}`,
    html: `<!doctype html><html><body style="margin:0;padding:24px;background:#f3f7fb;font-family:Arial,sans-serif;color:#172554"><div style="max-width:640px;margin:0 auto;padding:28px;background:#fff;border:1px solid #dbeafe;border-radius:16px"><h2 style="margin:0 0 18px;color:#1d4ed8">GuideShala Support</h2><p>Hello ${safeName},</p><div style="font-size:15px;line-height:1.7">${safeMessage}</div><div style="margin-top:24px;padding:16px;border-left:3px solid #16a34a;background:#f0fdf4;color:#475569"><strong>Your original feedback</strong><p style="margin:8px 0 0;line-height:1.6">${safeOriginal}</p></div><p style="margin:24px 0 0">Regards,<br>${escapeHtml(fromName)}</p></div></body></html>`,
  });
}
