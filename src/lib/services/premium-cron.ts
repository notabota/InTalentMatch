import { prisma } from "@/lib/prisma";
import { transfer } from "@/lib/services/payment";
import { sendNotification } from "@/lib/services/notification";
import { calculatePremiumPrice } from "@/lib/premium";

export interface PremiumCronResult {
  inactiveExpired: number;
  renewed: number;
  cancelled: number;
}

export async function runPremiumExpiry(): Promise<PremiumCronResult> {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 1);

  const inactiveExpired = await prisma.provider.updateMany({
    where: {
      isSubscriptionActive: false,
      subscriptionDate: { not: null, lt: cutoff },
    },
    data: {
      isPremium: false,
      subscriptionDate: null,
    },
  });

  const expiringActive = await prisma.provider.findMany({
    where: {
      isSubscriptionActive: true,
      subscriptionDate: { not: null, lt: cutoff },
    },
    include: { account: true },
  });

  let renewed = 0;
  let cancelled = 0;

  for (const provider of expiringActive) {
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { accountId: provider.accountId },
    });

    let success = false;
    if (paymentMethod) {
      success = await transfer([
        {
          kind: "DebitPaymentCommand",
          from: { id: paymentMethod.id },
          amount: calculatePremiumPrice({
            email: provider.account.email,
            isPremium: provider.isPremium,
          }),
        },
      ]);
    }

    if (success) {
      await prisma.provider.update({
        where: { id: provider.id },
        data: {
          isPremium: true,
          isSubscriptionActive: true,
          subscriptionDate: now,
        },
      });
      await sendNotification({
        accountId: provider.accountId,
        title: "Subscription",
        content: "Your premium subscription has been successfully extended.",
      });
      renewed += 1;
    } else {
      await prisma.provider.update({
        where: { id: provider.id },
        data: {
          isPremium: false,
          isSubscriptionActive: false,
          subscriptionDate: null,
        },
      });
      await sendNotification({
        accountId: provider.accountId,
        title: "Subscription",
        content: paymentMethod
          ? "Your premium subscription has been canceled, since the renewal payment failed."
          : "Your premium subscription has been canceled, since you do not have a valid payment method.",
      });
      cancelled += 1;
    }
  }

  return {
    inactiveExpired: inactiveExpired.count,
    renewed,
    cancelled,
  };
}
