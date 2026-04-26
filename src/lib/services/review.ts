import { prisma } from "@/lib/prisma";
import { reviewToModel } from "@/lib/mappers";
import type { ReviewModel } from "@/lib/models";

export async function addReview(input: {
  requestId: string;
  rating: number;
  description: string | null;
}): Promise<ReviewModel | null> {
  return prisma.$transaction(async (tx) => {
    const request = await tx.request.findUnique({
      where: { id: input.requestId },
      include: { selected: true },
    });
    if (!request || request.completedDate === null || !request.selected) {
      return null;
    }

    const review = await tx.review.create({
      data: {
        requestId: input.requestId,
        rating: input.rating,
        description: input.description,
      },
    });
    await tx.provider.update({
      where: { id: request.selected.providerId },
      data: {
        totalRating: { increment: input.rating },
        reviewCount: { increment: 1 },
      },
    });
    return reviewToModel(review);
  });
}

export async function getReviewByRequest(requestId: string): Promise<ReviewModel | null> {
  const row = await prisma.review.findUnique({ where: { requestId } });
  return row ? reviewToModel(row) : null;
}

export async function getReviewsByProvider(providerId: string): Promise<ReviewModel[]> {
  const rows = await prisma.review.findMany({
    where: { request: { selected: { providerId } } },
  });
  return rows.map(reviewToModel);
}
