import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paymentMethodToModel } from "@/lib/mappers";
import type { PaymentCommand, PaymentMethodModel } from "@/lib/models";

type Db = Prisma.TransactionClient | typeof prisma;

export async function getPaymentMethods(accountId: string): Promise<PaymentMethodModel[]> {
  const rows = await prisma.paymentMethod.findMany({
    where: { accountId },
  });
  return rows.map(paymentMethodToModel);
}

export async function getPaymentMethodById(id: string): Promise<PaymentMethodModel | null> {
  const row = await prisma.paymentMethod.findUnique({ where: { id } });
  return row ? paymentMethodToModel(row) : null;
}

export async function addCard(
  accountId: string,
  card: { number: string; expiry: string; cvv: string; name: string },
): Promise<PaymentMethodModel> {
  const row = await prisma.paymentMethod.create({
    data: {
      accountId,
      type: "CardPaymentMethod",
      number: card.number,
      expiry: card.expiry,
      name: card.name,
      cvv: card.cvv,
    },
  });
  return paymentMethodToModel(row);
}

async function applyCommands(db: Db, commands: PaymentCommand[]): Promise<void> {
  for (const cmd of commands) {
    if (cmd.from) {
      await db.paymentMethod.findUniqueOrThrow({ where: { id: cmd.from.id } });
    }
    if (cmd.to) {
      await db.paymentMethod.findUniqueOrThrow({ where: { id: cmd.to.id } });
    }
    await db.paymentCommand.create({
      data: {
        fromId: cmd.from?.id ?? null,
        toId: cmd.to?.id ?? null,
        amount: new Prisma.Decimal(cmd.amount),
        type: cmd.kind,
      },
    });
  }
}

export async function transfer(commands: PaymentCommand[]): Promise<boolean> {
  try {
    await prisma.$transaction(async (tx) => {
      await applyCommands(tx, commands);
    });
    return true;
  } catch (err) {
    console.error("transfer failed", err);
    return false;
  }
}

export async function transferInTx(
  tx: Prisma.TransactionClient,
  commands: PaymentCommand[],
): Promise<boolean> {
  try {
    await applyCommands(tx, commands);
    return true;
  } catch (err) {
    console.error("transferInTx failed", err);
    return false;
  }
}
