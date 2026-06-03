import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { offerToModel, requestToModel } from "@/lib/mappers";
import type { OfferModel, RequestModel } from "@/lib/models";

const requestInclude = {
  consumer: { include: { account: true } },
  selected: { include: { provider: { include: { account: true } } } },
} satisfies Prisma.RequestInclude;

const offerInclude = {
  provider: { include: { account: true } },
} satisfies Prisma.OfferInclude;

export async function createRequest(input: {
  consumerId: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  dueDate: Date | null;
  remoteEligible: boolean;
}): Promise<RequestModel> {
  return prisma.$transaction(async (tx) => {
    const row = await tx.request.create({
      data: {
        consumerId: input.consumerId,
        title: input.title,
        description: input.description,
        location: input.location,
        budget: new Prisma.Decimal(input.budget),
        dueDate: input.dueDate,
        remoteEligible: input.remoteEligible,
      },
      include: requestInclude,
    });
    await tx.consumer.update({
      where: { id: input.consumerId },
      data: { requestsPosted: { increment: 1 } },
    });
    return requestToModel(row);
  });
}

export async function getRequest(requestId: string): Promise<RequestModel | null> {
  const row = await prisma.request.findUnique({
    where: { id: requestId },
    include: requestInclude,
  });
  return row ? requestToModel(row) : null;
}

export async function getRequests(filter: {
  consumerId?: string;
  providerId?: string;
}): Promise<RequestModel[]> {
  const where: Prisma.RequestWhereInput = {};
  if (filter.consumerId) where.consumerId = filter.consumerId;
  if (filter.providerId) {
    where.offers = { some: { providerId: filter.providerId } };
  }
  const rows = await prisma.request.findMany({
    where,
    include: requestInclude,
  });
  return rows.map(requestToModel);
}

export async function getCompletedRequests(providerId: string): Promise<RequestModel[]> {
  const rows = await prisma.request.findMany({
    where: {
      completedDate: { not: null },
      selected: { providerId },
    },
    include: requestInclude,
  });
  return rows.map(requestToModel);
}

export async function findRequests(filter: {
  keywords?: string;
  categoryIds?: string[];
  location?: string;
  isCompleted: boolean;
}): Promise<RequestModel[]> {
  const where: Prisma.RequestWhereInput = {
    completedDate: filter.isCompleted ? { not: null } : null,
  };
  if (filter.location) where.location = filter.location;
  if (filter.categoryIds && filter.categoryIds.length > 0) {
    where.categories = { some: { categoryId: { in: filter.categoryIds } } };
  }

  const rows = await prisma.request.findMany({
    where,
    include: requestInclude,
    distinct: ["id"],
  });

  const keywords = filter.keywords?.toLowerCase().split(/\s+/).filter(Boolean);
  const filtered = keywords && keywords.length > 0
    ? rows.filter((r) => {
        const text = `${r.title} ${r.description}`.toLowerCase().split(/\s+/);
        return keywords.some((k) => text.includes(k));
      })
    : rows;

  return filtered.map(requestToModel);
}

export async function completeRequest(
  requestId: string,
  beforeCommit: (tx: Prisma.TransactionClient, req: RequestModel) => Promise<boolean>,
): Promise<RequestModel | null> {
  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.request.findUnique({
        where: { id: requestId },
        include: requestInclude,
      });
      if (!existing || existing.completedDate !== null) {
        return null;
      }

      const updated = await tx.request.update({
        where: { id: requestId },
        data: { completedDate: new Date() },
        include: requestInclude,
      });
      await tx.consumer.update({
        where: { id: existing.consumerId },
        data: { requestsCompleted: { increment: 1 } },
      });

      const okFlag = await beforeCommit(tx, requestToModel(updated));
      if (!okFlag) {
        throw new Error("payment failed");
      }
      return requestToModel(updated);
    });
  } catch (err) {
    console.error("completeRequest failed", err);
    return null;
  }
}

export async function createOffer(input: {
  providerId: string;
  requestId: string;
  price: number | null;
}): Promise<OfferModel> {
  const row = await prisma.offer.create({
    data: {
      providerId: input.providerId,
      requestId: input.requestId,
      price: input.price === null ? null : new Prisma.Decimal(input.price),
    },
    include: offerInclude,
  });
  return offerToModel(row);
}

export async function getOffer(offerId: string): Promise<OfferModel | null> {
  const row = await prisma.offer.findUnique({
    where: { id: offerId },
    include: offerInclude,
  });
  return row ? offerToModel(row) : null;
}

export async function getOffersForRequest(requestId: string): Promise<OfferModel[]> {
  const rows = await prisma.offer.findMany({
    where: { requestId },
    include: offerInclude,
  });
  return rows.map(offerToModel);
}

export async function selectOffer(offerId: string): Promise<OfferModel | null> {
  return prisma.$transaction(async (tx) => {
    const offer = await tx.offer.findUnique({
      where: { id: offerId },
      include: { ...offerInclude, request: true },
    });
    if (!offer) return null;
    if (offer.request.completedDate !== null) return null;

    await tx.request.update({
      where: { id: offer.requestId },
      data: { selectedId: offerId },
    });
    return offerToModel(offer);
  });
}
