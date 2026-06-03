import type { NextRequest } from "next/server";
import { badRequest, ok, unauthorized, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import { getOffer, getRequest, selectOffer } from "@/lib/services/request";
import { getConsumer } from "@/lib/services/profile";
import { sendNotification } from "@/lib/services/notification";
import { readForm } from "@/lib/reqparse";
import { ErrorStrings } from "@/lib/errors";

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const form = await readForm(req);
    const requestId = form.get("requestId");
    const offerId = form.get("offerId");
    if (!requestId || !offerId) return badRequest();

    const consumer = await getConsumer(accountId);
    if (!consumer) return unauthorized(ErrorStrings.NotAConsumer);

    const request = await getRequest(requestId);
    if (!request || request.consumer.id !== consumer.id) {
      return badRequest(ErrorStrings.InvalidRequest);
    }
    if (request.completedDate) return badRequest(ErrorStrings.RequestAlreadyComplete);

    const oldOffer = request.selected;

    const offerExisting = await getOffer(offerId);
    if (!offerExisting || offerExisting.request !== requestId) {
      return badRequest(ErrorStrings.InvalidOffer);
    }

    const offer = await selectOffer(offerId);
    if (!offer) return badRequest(ErrorStrings.ErrorTryAgain);

    await sendNotification({
      accountId: offer.provider.account,
      title: "Tasks",
      content: `Your offer for "${request.title}" has been selected.`,
    });
    if (oldOffer) {
      await sendNotification({
        accountId: oldOffer.provider.account,
        title: "Tasks",
        content: `Unfortunately, your offer for "${request.title}" has been unselected.`,
      });
    }

    return ok(await getRequest(request.id));
  });
}
