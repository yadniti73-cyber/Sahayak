import { cache } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/guards";
import { ROLE_HOME_ROUTES } from "@/lib/routes";

// Layout and page both call requirePageAccess() in one request;
// cache() makes the session/user lookup run only once.
const getCurrentUserOnce = cache(getCurrentUser);


export async function requirePageAccess(allowedRoles) {
  const user = await getCurrentUserOnce();

  if (!user) {
    redirect("/login");
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    redirect(ROLE_HOME_ROUTES[user.role] || "/login");
  }

  return user;
}
