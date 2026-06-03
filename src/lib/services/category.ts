import { prisma } from "@/lib/prisma";
import { categoryToModel } from "@/lib/mappers";
import type { CategoryModel } from "@/lib/models";

export async function getCategories(): Promise<CategoryModel[]> {
  const rows = await prisma.category.findMany();
  return rows.map(categoryToModel);
}

export async function getCategoriesFor(names: string[]): Promise<CategoryModel[]> {
  const lowered = names.map((n) => n.toLowerCase());
  const result: CategoryModel[] = [];

  await prisma.$transaction(async (tx) => {
    const existing = await tx.category.findMany({
      where: { name: { in: lowered } },
    });
    const existingNames = new Set(existing.map((c) => c.name));
    for (const c of existing) {
      result.push(categoryToModel(c));
    }

    const missing = lowered.filter((n) => !existingNames.has(n));
    if (missing.length > 0) {
      await tx.category.createMany({
        data: missing.map((name) => ({ name })),
      });
      const created = await tx.category.findMany({
        where: { name: { in: missing } },
      });
      for (const c of created) {
        result.push(categoryToModel(c));
      }
    }
  });

  return result;
}

export async function setProviderCategories(
  providerId: string,
  categoryIds: string[],
): Promise<CategoryModel[]> {
  return prisma.$transaction(async (tx) => {
    const cats = await tx.category.findMany({
      where: { id: { in: categoryIds } },
    });
    if (cats.length !== categoryIds.length) {
      return [];
    }
    await tx.providerCategory.deleteMany({ where: { providerId } });
    await tx.providerCategory.createMany({
      data: cats.map((c) => ({ providerId, categoryId: c.id })),
    });
    return cats.map(categoryToModel);
  });
}

export async function getProviderCategories(providerId: string): Promise<CategoryModel[]> {
  const rows = await prisma.providerCategory.findMany({
    where: { providerId },
    include: { category: true },
  });
  return rows.map((pc) => categoryToModel(pc.category));
}

export async function setRequestCategories(
  requestId: string,
  categoryIds: string[],
): Promise<CategoryModel[]> {
  return prisma.$transaction(async (tx) => {
    const cats = await tx.category.findMany({
      where: { id: { in: categoryIds } },
    });
    if (cats.length !== categoryIds.length) {
      return [];
    }
    await tx.requestCategory.deleteMany({ where: { requestId } });
    await tx.requestCategory.createMany({
      data: cats.map((c) => ({ requestId, categoryId: c.id })),
    });
    return cats.map(categoryToModel);
  });
}

export async function getRequestCategories(requestId: string): Promise<CategoryModel[]> {
  const rows = await prisma.requestCategory.findMany({
    where: { requestId },
    include: { category: true },
  });
  return rows.map((rc) => categoryToModel(rc.category));
}
