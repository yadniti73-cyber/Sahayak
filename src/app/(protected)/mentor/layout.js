import { requirePageAccess } from "@/server/auth/route-guards";

export const dynamic = "force-dynamic";

export default async function MentorLayout({ children }) {
  await requirePageAccess(["MENTOR"]);
  return children;
}
