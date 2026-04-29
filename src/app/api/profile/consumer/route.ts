import type { NextRequest } from "next/server";
import { badRequest, notFound, ok, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import { createConsumer, getConsumer } from "@/lib/services/profile";
import { ErrorStrings } from "@/lib/errors";

export async function POST() {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const consumer = await createConsumer(accountId);
    return ok(consumer);
  });
}

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const queryAccountId = req.nextUrl.searchParams.get("accountId");
    const accountId = queryAccountId ?? (await requireAccountId());
    if (!accountId) return badRequest(ErrorStrings.SessionExpired);

    const consumer = await getConsumer(accountId);
    return consumer ? ok(consumer) : notFound();
  });
}
