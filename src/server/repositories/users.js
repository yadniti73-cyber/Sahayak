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
