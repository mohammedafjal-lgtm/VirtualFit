import { auth } from "@/lib/auth";
import { fail } from "./response";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, response: fail(401, "Unauthorized") };
  }
  return { session, response: null };
}