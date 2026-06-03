import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const cutoff = new Date(Date.now() - 7 * 86_400_000);
    const rows = await prisma.request.findMany({
      where: { completedDate: { gte: cutoff } },
      select: { id: true, title: true, completedDate: true, budget: true },
      orderBy: { completedDate: "desc" },
    });
    console.log(`completed in last 7 days: ${rows.length}`);
    for (const r of rows) {
      console.log(`  ${r.completedDate?.toISOString()}\t$${r.budget}\t${r.title}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
