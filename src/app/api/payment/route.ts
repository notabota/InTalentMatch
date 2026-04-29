import { ok, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import { getPaymentMethods } from "@/lib/services/payment";

export async function GET() {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const result = await getPaymentMethods(accountId);
    return ok(result);
  });
}
