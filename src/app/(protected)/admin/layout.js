import { requirePageAccess } from "@/server/auth/route-guards";

// Runs on the server for every request, so the role is always read from the DB
// (via getCurrentUser) and never trusted from the client.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  await requirePageAccess(["ADMIN"]);
  return children;
}
