import type { NextRequest } from "next/server";
import { badRequest, notFound, ok, unauthorized, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import {
  createRequest,
  getRequest,
  getOffersForRequest,
  getRequests,
} from "@/lib/services/request";
import { getConsumer, getProvider } from "@/lib/services/profile";
import {
  getCategoriesFor,
  getRequestCategories,
  setRequestCategories,
} from "@/lib/services/category";
import { parseBool, parseDate, readForm } from "@/lib/reqparse";
import { ErrorStrings } from "@/lib/errors";

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const form = await readForm(req);

    const title = form.get("title");
    const description = form.get("description");
    const location = form.get("location");
    const budgetRaw = form.get("budget");
    const dueDateRaw = form.get("dueDate");
    const remoteRaw = form.get("remoteEligible");
    const categoryNames = form.getAll("category");

    if (!title || !description || !location || !budgetRaw || remoteRaw === null) {
      return badRequest();
    }
    const budget = Number(budgetRaw);
    if (Number.isNaN(budget)) return badRequest();
    const remoteEligible = parseBool(remoteRaw);
    if (remoteEligible === null) return badRequest();

    const consumer = await getConsumer(accountId);
    if (!consumer) return unauthorized(ErrorStrings.NotAConsumer);

    const created = await createRequest({
      consumerId: consumer.id,
      title,
      description,
      location,
      budget,
      dueDate: parseDate(dueDateRaw),
      remoteEligible,
    });

    if (categoryNames.length > 0) {
      const cats = await getCategoriesFor(categoryNames);
      created.categories = await setRequestCategories(
        created.id,
        cats.map((c) => c.id),
      );
    }

    return ok(created);
  });
}

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const requestId = req.nextUrl.searchParams.get("requestId");
    if (requestId) {
      const r = await getRequest(requestId);
      if (!r) return notFound();
      r.offers = await getOffersForRequest(requestId);
      r.categories = await getRequestCategories(requestId);
      return ok(r);
    }

    const accountId = await requireAccountId();
    const type = req.nextUrl.searchParams.get("type")?.toLowerCase();

    if (!type || type === "consumer") {
      const consumer = await getConsumer(accountId);
      if (!consumer) return unauthorized(ErrorStrings.NotAConsumer);
      const rows = await getRequests({ consumerId: consumer.id });
      return ok(rows);
    }
    if (type === "provider") {
      const provider = await getProvider(accountId);
      if (!provider) return unauthorized(ErrorStrings.NotAProvider);
      const rows = await getRequests({ providerId: provider.id });
      return ok(rows);
    }
    return badRequest(ErrorStrings.InvalidProfileType);
  });
}
