import { requirePageAccess } from "@/server/auth/route-guards";

export const dynamic = "force-dynamic";

// Seeker area: any signed-in user may view it, but anonymous visitors are sent to /login.
export default async function DashboardLayout({ children }) {
  await requirePageAccess();
  return children;
}
