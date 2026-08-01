import { z } from "zod";
import { connectMongo } from "@/server/db/mongo";
import { findUserById, updateUser } from "@/server/repositories/users";

const profileUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  preferredLanguage: z.string().optional(),
  bio: z.string().optional(),
});

export async function getUserProfile(userId) {
  await connectMongo();
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    city: user.city || "",
    phone: user.phone || "",
    preferredLanguage: user.preferredLanguage || "",
    bio: user.bio || "",
  };
}

export async function updateUserProfile(userId, payload) {
  const parsed = profileUpdateSchema.parse(payload);
  await connectMongo();

  const user = await updateUser(userId, parsed);
  if (!user) {
    throw new Error("Unable to update profile.");
  }

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    city: user.city || "",
    phone: user.phone || "",
    preferredLanguage: user.preferredLanguage || "",
    bio: user.bio || "",
  };
}
