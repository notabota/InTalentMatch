import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { badRequest, ok, withErrorHandler } from "@/lib/http";
import { SESSION_COOKIE } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { readForm } from "@/lib/reqparse";
import { hashPassword, validatePasswordPolicy } from "@/lib/password";
import { signToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";

const CONFIRM_TTL_SECONDS = 60 * 60 * 24;

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const form = await readForm(req);
    const email = form.get("email")?.trim().toLowerCase();
    const password = form.get("password");
    const fullName = form.get("fullName");
    const sendConfirmation = form.get("sendConfirmation") !== "false";

    if (!email) return badRequest("Email is required.");
    if (!password) return badRequest("Password is required.");
    const policyErr = validatePasswordPolicy(password);
    if (policyErr) return badRequest(policyErr);

    const existing = await prisma.account.findFirst({ where: { email } });
    if (existing) return badRequest("Email already registered.");

    const id = randomUUID();
    const normalizedEmail = email.toUpperCase();
    const passwordHash = await hashPassword(password);
    const securityStamp = randomUUID();

    const user = await prisma.account.create({
      data: {
        id,
        userName: email,
        normalizedUserName: normalizedEmail,
        email,
        normalizedEmail,
        passwordHash,
        securityStamp,
        emailConfirmed: false,
        fullName,
      },
    });

    if (sendConfirmation && process.env.POSTMARK_API_KEY) {
      const token = await signToken(
        { sub: user.id, kind: "email-confirm", email, stamp: securityStamp },
        CONFIRM_TTL_SECONDS,
      );
      const origin = process.env.APP_ORIGIN ?? new URL(req.url).origin;
      const link = `${origin.replace(/\/+$/, "")}/Account/ConfirmEmail?token=${encodeURIComponent(
        token,
      )}`;
      await sendEmail({
        to: email,
        subject: "Confirm your email",
        textBody: `Welcome to InTalentMatch. Confirm your email by visiting:\n\n${link}\n\nLink expires in 24 hours.`,
      });
    }

    const store = await cookies();
    store.set(SESSION_COOKIE, user.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return ok({ id: user.id, email: user.email });
  });
}
