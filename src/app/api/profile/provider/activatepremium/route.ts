import type { NextRequest } from "next/server";
import { badRequest, ok, unauthorized, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { providerToModel } from "@/lib/mappers";
import { getProvider } from "@/lib/services/profile";
import { getPaymentMethods, transferInTx } from "@/lib/services/payment";
import { sendNotification } from "@/lib/services/notification";
import { readForm } from "@/lib/reqparse";
import { calculatePremiumPrice } from "@/lib/premium";
import { ErrorStrings } from "@/lib/errors";

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const form = await readForm(req);
    let paymentMethodId = form.get("paymentMethod");

    const provider = await getProvider(accountId);
    if (!provider) return unauthorized(ErrorStrings.NotAProvider);
    if (provider.isSubscriptionActive) return badRequest(ErrorStrings.PremiumAlreadyActive);

    const methods = await getPaymentMethods(accountId);
    const methodsById = new Map(methods.map((m) => [m.id, m]));

    if (paymentMethodId) {
      if (!methodsById.has(paymentMethodId)) {
        return badRequest(ErrorStrings.InvalidPaymentMethod);
      }
    } else {
      if (methods.length === 0) return badRequest(ErrorStrings.NoPaymentMethod);
      paymentMethodId = methods[0].id;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const dbProvider = await tx.provider.findUnique({
        where: { id: provider.id },
        include: { account: true },
      });
      if (!dbProvider) return null;

      const paymentOk = dbProvider.subscriptionDate
        ? true
        : await transferInTx(tx, [
            {
              kind: "DebitPaymentCommand",
              from: methodsById.get(paymentMethodId!)!,
              amount: calculatePremiumPrice({
                email: dbProvider.account.email,
                isPremium: dbProvider.isPremium,
              }),
            },
          ]);
      if (!paymentOk) return null;

      const result = await tx.provider.update({
        where: { id: provider.id },
        data: {
          isPremium: true,
          isSubscriptionActive: true,
          subscriptionDate: dbProvider.subscriptionDate ?? new Date(),
        },
        include: { account: true },
      });
      return providerToModel(result);
    });

    if (!updated) return badRequest(ErrorStrings.ErrorTryAgain);

    await sendNotification({
      accountId: updated.account,
      title: "Subscription",
      content: "Your premium subscription has been activated.",
    });

    return ok(updated);
  });
}
