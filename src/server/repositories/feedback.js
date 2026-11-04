import { Feedback } from "@/server/models/feedback";

export async function createFeedback(payload) {
  return new Feedback(payload).save();
}

export async function listFeedback({ limit = 300 } = {}) {
  return Feedback.find({}).sort({ createdAt: -1 }).limit(limit).lean();
}

export async function findFeedbackById(id) {
  return Feedback.findById(id).lean();
}

export async function deleteFeedbackById(id) {
  return Feedback.findByIdAndDelete(id).lean();
}
