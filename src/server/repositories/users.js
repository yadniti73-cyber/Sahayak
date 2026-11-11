import { User } from "@/server/models/user";

export async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase().trim() }).lean();
}

export async function findUserById(id) {
  return User.findById(id).lean();
}

export async function createUser({ email, passwordHash = "", provider = "local", providerId = null, pictureUrl = "", firstName, lastName, role = "SEEKER" }) {
  const user = new User({ email, passwordHash, provider, providerId, pictureUrl, firstName, lastName, role });
  return user.save();
}

export async function findUserByProvider(provider, providerId) {
  return User.findOne({ provider, providerId }).lean();
}

export async function updateUser(id, updates) {
  return User.findByIdAndUpdate(id, updates, { new: true }).lean();
}

export async function findUsersByRole(role) {
  return User.find({ role, status: "ACTIVE" }, { _id: 1 }).lean();
}


export async function countActiveAdmins({ session } = {}) {
  return User.countDocuments({ role: "ADMIN", status: "ACTIVE" }).session(session || null);
}

export async function updateUserRole(id, role, { session } = {}) {
  return User.findOneAndUpdate(
    { _id: id, status: "ACTIVE" },
    { $set: { role, updatedAt: new Date() } },
    { new: true, runValidators: true, session }
  ).lean();
}


/**
 * Serialize role mutations through one stable active-admin document. The write
 * participates in the caller's transaction, so concurrent demotions conflict
 * and retry against the newly committed admin count.
 */
export async function lockAdminRoleChanges({ session } = {}) {
  return User.findOneAndUpdate(
    { role: "ADMIN", status: "ACTIVE" },
    { $set: { updatedAt: new Date() } },
    { new: true, sort: { _id: 1 }, session }
  ).lean();
}


export async function findUserByIdForRoleChange(id, { session } = {}) {
  return User.findById(id).session(session || null);
}

export async function markUserEmailVerified(email) {
  return User.updateOne(
    { email: email.toLowerCase().trim() },
    { $set: { emailVerified: true, emailVerifiedAt: new Date() } }
  );
}
