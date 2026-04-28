import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { badRequest, ok, withErrorHandler } from "@/lib/http";
import { SESSION_COOKIE } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { readForm, parseBool } from "@/lib/reqparse";
import { verifyPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const form = await readForm(req);
    const rawEmail = form.get("email");
    const password = form.get("password");
    const isPersistent = parseBool(form.get("isPersistent")) ?? true;

    if (!rawEmail || !password) {
      return badRequest("Invalid email or password.");
    }
    const email = rawEmail.trim().toLowerCase();

    const user = await prisma.account.findFirst({ where: { email } });
    if (!user || !user.passwordHash) {
      return badRequest("Invalid email or password.");
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return badRequest("Invalid email or password.");
    }

    const store = await cookies();
    store.set(SESSION_COOKIE, user.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: isPersistent ? 60 * 60 * 24 * 30 : undefined,
    });

    return ok({ id: user.id, email: user.email });
  });
}
