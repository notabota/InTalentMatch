import type { NextRequest } from "next/server";
import { badRequest, ok, unauthorized, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import { completeRequest, getRequest } from "@/lib/services/request";
import { getProvider } from "@/lib/services/profile";
import { getPaymentMethods, transferInTx } from "@/lib/services/payment";
import { sendNotification } from "@/lib/services/notification";
import { readForm } from "@/lib/reqparse";
import { calculateTransactionFee } from "@/lib/premium";
import { ErrorStrings } from "@/lib/errors";

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const form = await readForm(req);
    const requestId = form.get("requestId");
    if (!requestId) return badRequest();

    const provider = await getProvider(accountId);
    if (!provider) return unauthorized(ErrorStrings.NotAProvider);

    const request = await getRequest(requestId);
    if (
      !request ||
      !request.selected ||
      request.selected.provider.id !== provider.id
    ) {
      return badRequest(ErrorStrings.InvalidRequest);
    }
    if (request.completedDate) return badRequest(ErrorStrings.RequestAlreadyComplete);

    const [providerMethod] = await getPaymentMethods(accountId);
    const [consumerMethod] = await getPaymentMethods(request.consumer.account);
    if (!providerMethod || !consumerMethod) {
      return badRequest(ErrorStrings.NoPaymentMethod);
    }

    const completed = await completeRequest(requestId, async (tx) => {
      const price = Math.min(request.selected!.price ?? request.budget, request.budget);
      const fee = calculateTransactionFee(provider, price);
      return transferInTx(tx, [
        { kind: "TransferPaymentCommand", from: consumerMethod, to: providerMethod, amount: price },
        { kind: "DebitPaymentCommand", from: providerMethod, amount: fee },
      ]);
    });
    if (!completed) return badRequest(ErrorStrings.ErrorTryAgain);

    await sendNotification({
      accountId: request.consumer.account,
      title: "Tasks",
      content: `"${request.title}" has been completed.`,
    });
    await sendNotification({
      accountId: provider.account,
      title: "Tasks",
      content: `"${request.title}" has been completed.`,
    });

    return ok(await getRequest(requestId));
  });
}
