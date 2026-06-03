import type { NextRequest } from "next/server";
import { badRequest, ok, unauthorized, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import { createOffer, getRequest } from "@/lib/services/request";
import { getProvider } from "@/lib/services/profile";
import { sendNotification } from "@/lib/services/notification";
import { readForm, parseNumber } from "@/lib/reqparse";
import { ErrorStrings } from "@/lib/errors";

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const form = await readForm(req);
    const requestId = form.get("requestId");
    if (!requestId) return badRequest();
    const price = parseNumber(form.get("price"));

    const provider = await getProvider(accountId);
    if (!provider) return unauthorized(ErrorStrings.NotAProvider);

    const request = await getRequest(requestId);
    if (!request) return badRequest(ErrorStrings.InvalidRequest);
    if (price !== null && price > request.budget) {
      return badRequest(ErrorStrings.OfferPriceExceedsBudget);
    }

    const offer = await createOffer({
      providerId: provider.id,
      requestId,
      price,
    });

    await sendNotification({
      accountId: request.consumer.account,
      title: "Tasks",
      content:
        `A provider is offering to do "${request.title}"` +
        (offer.price !== null ? ` for $${offer.price}.` : "."),
    });

    return ok(offer);
  });
}
