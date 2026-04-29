import type { NextRequest } from "next/server";
import { badRequest, notFound, ok, unauthorized, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import {
  createProvider,
  getProvider,
  updateProvider,
} from "@/lib/services/profile";
import {
  getCategoriesFor,
  getProviderCategories,
  setProviderCategories,
} from "@/lib/services/category";
import { getCompletedRequests } from "@/lib/services/request";
import { readForm } from "@/lib/reqparse";
import { ErrorStrings } from "@/lib/errors";
import type { ProviderModel } from "@/lib/models";

export async function POST() {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const provider = await createProvider(accountId);
    return ok(provider);
  });
}

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const queryAccountId = req.nextUrl.searchParams.get("accountId");
    const accountId = queryAccountId ?? (await requireAccountId());
    if (!accountId) return badRequest(ErrorStrings.SessionExpired);

    const provider = await getProvider(accountId);
    if (!provider) return notFound();

    if (provider.reviewCount !== 0) {
      provider.averageRating = (provider.totalRating ?? 0) / provider.reviewCount;
    }
    provider.totalRating = undefined;

    provider.categories = await getProviderCategories(provider.id);
    provider.completedRequests = await getCompletedRequests(provider.id);

    return ok(provider);
  });
}

export async function PATCH(req: NextRequest) {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const form = await readForm(req);
    const description = form.get("description");
    const categoryRaw = form.getAll("category");

    const existing = await getProvider(accountId);
    if (!existing) return unauthorized(ErrorStrings.NotAProvider);

    let newCategories: ProviderModel["categories"] = undefined;

    const updated = await updateProvider(existing.id, async (p) => {
      p.description = description;
      if (categoryRaw.length > 0) {
        const cats = await getCategoriesFor(categoryRaw);
        newCategories = await setProviderCategories(
          existing.id,
          cats.map((c) => c.id),
        );
      }
      return p;
    });

    if (!updated) return badRequest(ErrorStrings.ErrorTryAgain);
    if (newCategories) updated.categories = newCategories;
    return ok(updated);
  });
}
