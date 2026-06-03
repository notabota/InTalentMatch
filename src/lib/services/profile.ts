import { prisma } from "@/lib/prisma";
import { providerToModel, consumerToModel } from "@/lib/mappers";
import type { ConsumerModel, ProviderModel } from "@/lib/models";

function isExpired(subscriptionDate: Date | null): boolean {
  if (!subscriptionDate) {
    return false;
  }
  const oneMonthAgo = new Date();
  oneMonthAgo.setUTCMonth(oneMonthAgo.getUTCMonth() - 1);
  return subscriptionDate < oneMonthAgo;
}

async function applyLazyExpiry(providerId: string): Promise<void> {
  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
    select: {
      isPremium: true,
      isSubscriptionActive: true,
      subscriptionDate: true,
    },
  });
  if (!provider) return;

  if (provider.isPremium && isExpired(provider.subscriptionDate)) {
    await prisma.provider.update({
      where: { id: providerId },
      data: {
        isPremium: false,
        isSubscriptionActive: false,
        subscriptionDate: null,
      },
    });
  }
}

export async function createProvider(accountId: string): Promise<ProviderModel> {
  const row = await prisma.provider.create({
    data: {
      accountId,
      description: null,
      totalRating: 0,
      reviewCount: 0,
      isPremium: false,
      isSubscriptionActive: false,
      subscriptionDate: null,
    },
    include: { account: true },
  });
  return providerToModel(row);
}

export async function getProvider(accountId: string): Promise<ProviderModel | null> {
  const row = await prisma.provider.findUnique({
    where: { accountId },
    include: { account: true },
  });
  if (!row) return null;

  await applyLazyExpiry(row.id);

  const refreshed = await prisma.provider.findUnique({
    where: { id: row.id },
    include: { account: true },
  });
  return refreshed ? providerToModel(refreshed) : null;
}

export async function getProviderById(providerId: string): Promise<ProviderModel | null> {
  await applyLazyExpiry(providerId);
  const row = await prisma.provider.findUnique({
    where: { id: providerId },
    include: { account: true },
  });
  return row ? providerToModel(row) : null;
}

export async function updateProvider(
  providerId: string,
  mutator: (p: ProviderModel) => Promise<ProviderModel | null>,
): Promise<ProviderModel | null> {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.provider.findUnique({
      where: { id: providerId },
      include: { account: true },
    });
    if (!existing) return null;

    const draft = providerToModel(existing);
    const updated = await mutator(draft);
    if (!updated) return null;

    const persisted = await tx.provider.update({
      where: { id: providerId },
      data: {
        description: updated.description,
        isPremium: updated.isPremium,
        isSubscriptionActive: updated.isSubscriptionActive,
        subscriptionDate: updated.subscriptionDate ? new Date(updated.subscriptionDate) : null,
        totalRating: updated.totalRating ?? existing.totalRating,
        reviewCount: updated.reviewCount,
      },
      include: { account: true },
    });
    return providerToModel(persisted);
  });
}

export async function createConsumer(accountId: string): Promise<ConsumerModel> {
  const row = await prisma.consumer.create({
    data: {
      accountId,
      requestsPosted: 0,
      requestsCompleted: 0,
    },
    include: { account: true },
  });
  return consumerToModel(row);
}

export async function getConsumer(accountId: string): Promise<ConsumerModel | null> {
  const row = await prisma.consumer.findUnique({
    where: { accountId },
    include: { account: true },
  });
  return row ? consumerToModel(row) : null;
}
