import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { notFound, ok, withErrorHandler } from "@/lib/http";
import { SESSION_COOKIE, getCurrentAccountId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { readForm } from "@/lib/reqparse";

export async function GET() {
  return withErrorHandler(async () => {
    const accountId = await getCurrentAccountId();
    if (!accountId) return notFound();

    const user = await prisma.account.findUnique({ where: { id: accountId } });
    if (!user) return notFound();

    return ok({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
  });
}

export async function PATCH(req: NextRequest) {
  return withErrorHandler(async () => {
    const accountId = await getCurrentAccountId();
    if (!accountId) return notFound();

    const form = await readForm(req);
    const fullName = form.get("fullName");
    const phoneNumber = form.get("phoneNumber");
    const address = form.get("address");

    await prisma.account.update({
      where: { id: accountId },
      data: {
        ...(fullName !== null ? { fullName } : {}),
        ...(phoneNumber !== null ? { phoneNumber } : {}),
        ...(address !== null ? { address } : {}),
      },
    });
    return ok(null);
  });
}
