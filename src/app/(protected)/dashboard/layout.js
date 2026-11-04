import { requirePageAccess } from "@/server/auth/route-guards";
import { AuthProvider } from "@/components/providers";

export const dynamic = "force-dynamic";

// Seeker area: any signed-in user may view it, but anonymous visitors are sent to /login.
export default async function DashboardLayout({ children }) {
  const user = await requirePageAccess();
  return <AuthProvider initialUser={user}>{children}</AuthProvider>;
}
