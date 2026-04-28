import { cookies } from "next/headers";
import { ok } from "@/lib/http";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return ok(null);
}
