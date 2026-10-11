import { MentorDocument } from "@/server/models/mentorDocument";

const META = "-data -iv -authTag";

export async function createMentorDocument(data) {
  const doc = await new MentorDocument(data).save();
  return { _id: doc._id, type: doc.type, originalName: doc.originalName, mimeType: doc.mimeType, size: doc.size, createdAt: doc.createdAt };
}

export async function listDocumentMeta(userId) {
  return MentorDocument.find({ userId }).select(META).sort({ createdAt: 1 }).lean();
}

export async function findDocumentById(id) {
  return MentorDocument.findById(id).lean();
}

export async function deleteDocumentById(id) {
  return MentorDocument.findByIdAndDelete(id).select(META).lean();
}

export async function deleteDocumentsByType(userId, type) {
  return MentorDocument.deleteMany({ userId, type });
}

export async function countDocumentsByType(userId) {
  const rows = await MentorDocument.aggregate([{ $match: { userId } }, { $group: { _id: "$type", n: { $sum: 1 } } }]);
  return rows.reduce((acc, r) => ({ ...acc, [r._id]: r.n }), {});
}
