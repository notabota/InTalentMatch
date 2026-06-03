import { badRequest, ok, unauthorized, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import { getProvider, updateProvider } from "@/lib/services/profile";
import { sendNotification } from "@/lib/services/notification";
import { ErrorStrings } from "@/lib/errors";

export async function POST() {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const provider = await getProvider(accountId);
    if (!provider) return unauthorized(ErrorStrings.NotAProvider);
    if (!provider.isSubscriptionActive) return badRequest(ErrorStrings.PremiumNotActive);

    const updated = await updateProvider(provider.id, async (p) => {
      p.isSubscriptionActive = false;
      return p;
    });

    if (!updated) return badRequest(ErrorStrings.ErrorTryAgain);

    await sendNotification({
      accountId: updated.account,
      title: "Subscription",
      content:
        "Your premium subscription has been deactivated. " +
        "Your benefits will remain until the next billing period.",
    });

    return ok(updated);
  });
}
