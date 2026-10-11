import { MentorVerification } from "@/server/models/mentorVerification";

export async function findVerificationByUserId(userId) {
  return MentorVerification.findOne({ userId }).lean();
}

export async function findVerificationByProfileId(mentorProfileId) {
  return MentorVerification.findOne({ mentorProfileId }).lean();
}

export async function upsertVerification(userId, mentorProfileId, set, push) {
  const update = { $set: set, $setOnInsert: { userId, mentorProfileId } };
  if (push) update.$push = push;
  return MentorVerification.findOneAndUpdate({ userId }, update, { new: true, upsert: true, setDefaultsOnInsert: true }).lean();
}

export async function updateVerificationById(id, set, push) {
  const update = { $set: set };
  if (push) update.$push = push;
  return MentorVerification.findByIdAndUpdate(id, update, { new: true }).lean();
}
