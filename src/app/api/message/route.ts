import type { NextRequest } from "next/server";
import { badRequest, ok, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import { getMessages, sendMessage } from "@/lib/services/message";
import { sendNotification } from "@/lib/services/notification";
import { parseDate } from "@/lib/reqparse";
import { ErrorStrings } from "@/lib/errors";

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const peerId = req.nextUrl.searchParams.get("peerId");
    if (!peerId) return badRequest();
    const after = parseDate(req.nextUrl.searchParams.get("after"));
    const result = await getMessages(accountId, peerId, after ?? undefined);
    return ok(result);
  });
}

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const peerId = req.nextUrl.searchParams.get("peerId");
    if (!peerId) return badRequest();

    const body = await req.json();
    const content = typeof body === "string" ? body : body?.content;
    if (typeof content !== "string" || content.length === 0) {
      return badRequest(ErrorStrings.ErrorTryAgain);
    }

    const message = await sendMessage({
      senderId: accountId,
      receiverId: peerId,
      content,
    });

    await sendNotification({
      accountId: peerId,
      title: "Messages",
      content: "You have an incoming message.",
    });

    return ok(message);
  });
}
