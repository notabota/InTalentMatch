/**
 * Example fixup script template.
 *
 * Incident:    (describe what went wrong)
 * Ticket:      (link)
 * Reviewed by: (name)
 * Run by:      (name)
 * Run at:      (UTC timestamp)
 */
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    // const result = await prisma.$transaction(async (tx) => {
    //   const touched = await tx.account.updateMany({
    //     where: { ... },
    //     data: { ... },
    //   });
    //   return touched.count;
    // });
    // console.log(`rows touched: ${result}`);
    console.log("template; replace with the actual fixup.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
