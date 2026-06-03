import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.provider.findMany({
      where: { isPremium: true, isSubscriptionActive: true },
      include: { account: { select: { email: true, fullName: true } } },
      orderBy: { subscriptionDate: "desc" },
    });
    console.log(`active premium providers: ${rows.length}`);
    for (const r of rows) {
      console.log(`  ${r.account.email}\t${r.account.fullName}\tsince ${r.subscriptionDate?.toISOString()}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
