import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { badRequest, ok, withErrorHandler } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { readForm } from "@/lib/reqparse";
import { hashPassword, validatePasswordPolicy } from "@/lib/password";
import { verifyToken } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const form = await readForm(req);
    const token = form.get("token") ?? form.get("code");
    const password = form.get("password");

    if (!token) return badRequest("Invalid or expired reset link.");
    if (!password) return badRequest("Password is required.");
    const policyErr = validatePasswordPolicy(password);
    if (policyErr) return badRequest(policyErr);

    let payload;
    try {
      payload = await verifyToken(token, "password-reset");
    } catch {
      return badRequest("Invalid or expired reset link.");
    }

    const user = await prisma.account.findUnique({ where: { id: payload.sub } });
    if (!user || user.securityStamp !== payload.stamp) {
      return badRequest("Invalid or expired reset link.");
    }

    const passwordHash = await hashPassword(password);
    await prisma.account.update({
      where: { id: user.id },
      data: {
        passwordHash,
        securityStamp: randomUUID(),
      },
    });

    return ok(null);
  });
}
