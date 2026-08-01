import { z } from "zod";
import { connectMongo } from "@/server/db/mongo";
import { createNotification, findNotificationsForUser, markNotificationRead, markNotificationsReadForUser } from "@/server/repositories/notifications";

export async function getNotifications(userId, { limit = 50, offset = 0 } = {}) {
  await connectMongo();
  return findNotificationsForUser(userId, { limit, offset });
}

export async function markNotificationAsRead(notificationId) {
  await connectMongo();
  return markNotificationRead(notificationId);
}

export async function markAllNotificationsRead(userId) {
  await connectMongo();
  return markNotificationsReadForUser(userId);
}

export async function createUserNotification(userId, { title, message, link }) {
  const payloadSchema = z.object({
    title: z.string().min(1),
    message: z.string().optional(),
    link: z.string().optional(),
  });

  const payload = payloadSchema.parse({ title, message, link });
  await connectMongo();
  return createNotification({
    userId,
    title: payload.title,
    message: payload.message || "",
    link: payload.link || "",
  });
}
