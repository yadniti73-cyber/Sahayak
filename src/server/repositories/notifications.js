import { Notification } from "@/server/models/notification";

export async function createNotification(data) {
  const notification = new Notification(data);
  return notification.save();
}

export async function findNotificationsForUser(userId, { limit = 50, offset = 0 } = {}) {
  return Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();
}

export async function markNotificationRead(notificationId) {
  return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true }).lean();
}

export async function markNotificationsReadForUser(userId) {
  return Notification.updateMany({ userId, read: false }, { read: true });
}
