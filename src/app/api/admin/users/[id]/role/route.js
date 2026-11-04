import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/guards";
import { connectMongo } from "@/server/db/mongo";
import { countActiveAdmins, findUserByIdForRoleChange, lockAdminRoleChanges, updateUserRole } from "@/server/repositories/users";
import { successResponse } from "@/server/utils/api-response";
import { handleRouteError } from "@/server/utils/route-helpers";

const ROLES = new Set(["SEEKER", "MENTOR", "ADMIN"]);

export async function PATCH(request, context) {
  let session;
  try {
    const actor = await requireRole("ADMIN");
    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }
    const body = await request.json().catch(() => ({}));
    const role = typeof body?.role === "string" ? body.role.toUpperCase() : "";
    if (!ROLES.has(role)) {
      return NextResponse.json({ success: false, message: "Choose a valid user role." }, { status: 422 });
    }
    if (String(actor.id) === String(id) && role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "You cannot remove your own admin role." }, { status: 409 });
    }

    await connectMongo();
    session = await mongoose.startSession();
    let updated = null;
    await session.withTransaction(async () => {
      // A shared document write serializes concurrent role changes across app instances.
      const roleLock = await lockAdminRoleChanges({ session });
      if (!roleLock) {
        const error = new Error("No active administrator is available to authorize this change.");
        error.status = 409;
        throw error;
      }
      const actorRecord = await findUserByIdForRoleChange(actor.id, { session });
      if (!actorRecord || actorRecord.status !== "ACTIVE" || actorRecord.role !== "ADMIN") {
        const error = new Error("Forbidden");
        throw error;
      }
      const target = await findUserByIdForRoleChange(id, { session });
      if (!target || target.status !== "ACTIVE") {
        const error = new Error("User not found or inactive.");
        error.status = 404;
        throw error;
      }
      if (target.role === "ADMIN" && role !== "ADMIN") {
        const admins = await countActiveAdmins({ session });
        if (admins <= 1) {
          const error = new Error("The last active admin cannot be demoted.");
          error.status = 409;
          throw error;
        }
      }
      updated = await updateUserRole(id, role, { session });
    });
    if (!updated) return NextResponse.json({ success: false, message: "User role was not changed." }, { status: 409 });
    return NextResponse.json(successResponse({
      user: { id: String(updated._id), role: updated.role, firstName: updated.firstName, lastName: updated.lastName, email: updated.email }
    }, "User role updated."));
  } catch (error) {
    return handleRouteError(error, "Unable to update user role.");
  } finally {
    if (session) await session.endSession();
  }
}
