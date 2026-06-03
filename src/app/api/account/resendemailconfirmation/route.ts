import type { NextRequest } from "next/server";
import { ok, withErrorHandler } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { readForm } from "@/lib/reqparse";
import { signToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";

const CONFIRM_TTL_SECONDS = 60 * 60 * 24;

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const form = await readForm(req);
    const rawEmail = form.get("email");
    if (!rawEmail) return ok(null);
    const email = rawEmail.trim().toLowerCase();

    const user = await prisma.account.findFirst({ where: { email } });
    if (!user || !user.email || user.emailConfirmed) {
      return ok(null);
    }

    const token = await signToken(
      { sub: user.id, kind: "email-confirm", email: user.email, stamp: user.securityStamp ?? "" },
      CONFIRM_TTL_SECONDS,
    );
    const origin = process.env.APP_ORIGIN ?? new URL(req.url).origin;
    const link = `${origin.replace(/\/+$/, "")}/Account/ConfirmEmail?token=${encodeURIComponent(
      token,
    )}`;

    await sendEmail({
      to: user.email,
      subject: "Confirm your email",
      textBody: `Confirm your email by visiting:\n\n${link}\n\nLink expires in 24 hours.`,
    });

    return ok(null);
  });
}
