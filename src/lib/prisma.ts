import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const STATEMENT_TIMEOUT_MS = Number(process.env.STATEMENT_TIMEOUT_MS ?? "30000");

function createClient(): PrismaClient {
  const client = new PrismaClient();
  if (process.env.NODE_ENV === "production" && Number.isFinite(STATEMENT_TIMEOUT_MS)) {
    client
      .$executeRawUnsafe(`SET statement_timeout = ${STATEMENT_TIMEOUT_MS}`)
      .catch((err) => console.error("failed to set statement_timeout", err));
  }
  return client;
}

export const prisma = global.__prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
