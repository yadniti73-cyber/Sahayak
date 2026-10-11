import { redirect } from "next/navigation";
import { requirePageAccess } from "@/server/auth/route-guards";
import { ROLE_HOME_ROUTES } from "@/lib/routes";

// /dashboard has no content of its own: send each role to its own workspace.
export default async function DashboardPage() {
  const user = await requirePageAccess();
  redirect(ROLE_HOME_ROUTES[user.role] || "/dashboard/home");
}
