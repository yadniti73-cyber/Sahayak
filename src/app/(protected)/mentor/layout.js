import { requirePageAccess } from "@/server/auth/route-guards";
import { AuthProvider } from "@/components/providers";

export const dynamic = "force-dynamic";

export default async function MentorLayout({ children }) {
  const user = await requirePageAccess(["MENTOR"]);
  return <AuthProvider initialUser={user}>{children}</AuthProvider>;
}
