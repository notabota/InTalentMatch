import type { NextRequest } from "next/server";
import { badRequest, ok, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import { getNotifications } from "@/lib/services/notification";
import { parseDate } from "@/lib/reqparse";

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const after = parseDate(req.nextUrl.searchParams.get("after"));
    const result = await getNotifications(accountId, after ?? undefined);
    return ok(result);
  });
}
