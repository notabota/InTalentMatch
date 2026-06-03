import type { NextRequest } from "next/server";
import { badRequest, notFound, ok, unauthorized, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import { addReview, getReviewByRequest, getReviewsByProvider } from "@/lib/services/review";
import { getRequest } from "@/lib/services/request";
import { getConsumer } from "@/lib/services/profile";
import { sendNotification } from "@/lib/services/notification";
import { readForm } from "@/lib/reqparse";
import { ErrorStrings } from "@/lib/errors";

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const requestId = req.nextUrl.searchParams.get("requestId");
    const providerId = req.nextUrl.searchParams.get("providerId");

    if (requestId && providerId) return badRequest();
    if (requestId) {
      const review = await getReviewByRequest(requestId);
      return review ? ok(review) : notFound();
    }
    if (providerId) {
      const reviews = await getReviewsByProvider(providerId);
      return ok(reviews);
    }
    return badRequest();
  });
}

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const form = await readForm(req);
    const requestId = form.get("requestId");
    const ratingRaw = form.get("rating");
    const description = form.get("description");

    if (!requestId || !ratingRaw) return badRequest();
    const rating = Number(ratingRaw);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return badRequest("Invalid rating.");
    }

    const consumer = await getConsumer(accountId);
    if (!consumer) return unauthorized(ErrorStrings.NotAConsumer);

    const request = await getRequest(requestId);
    if (
      !request ||
      !request.selected ||
      request.consumer.id !== consumer.id ||
      !request.completedDate
    ) {
      return badRequest(ErrorStrings.InvalidRequest);
    }

    const review = await addReview({
      requestId,
      rating,
      description: description ?? null,
    });
    if (!review) return badRequest(ErrorStrings.ErrorTryAgain);

    await sendNotification({
      accountId: request.selected.provider.account,
      title: "Reviews",
      content: `A review of your performance in "${request.title}" has been added.`,
    });

    return ok(review);
  });
}
