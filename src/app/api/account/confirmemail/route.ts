import type { NextRequest } from "next/server";
import { badRequest, ok, withErrorHandler } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { readForm } from "@/lib/reqparse";
import { verifyToken } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const form = await readForm(req);
    const token = form.get("token") ?? form.get("code");
    if (!token) return badRequest("Invalid confirmation link.");

    let payload;
    try {
      payload = await verifyToken(token, "email-confirm");
    } catch {
      return badRequest("Invalid confirmation link.");
    }

    const user = await prisma.account.findUnique({ where: { id: payload.sub } });
    if (!user) return badRequest("Invalid confirmation link.");
    if (user.emailConfirmed) return ok(null);

    await prisma.account.update({
      where: { id: user.id },
      data: { emailConfirmed: true },
    });

    return ok(null);
  });
}
