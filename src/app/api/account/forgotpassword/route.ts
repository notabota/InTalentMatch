import type { NextRequest } from "next/server";
import { ok, withErrorHandler } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { readForm } from "@/lib/reqparse";
import { signToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";

const RESET_TTL_SECONDS = 60 * 60;

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const form = await readForm(req);
    const rawEmail = form.get("email");
    if (!rawEmail) return ok(null);
    const email = rawEmail.trim().toLowerCase();

    const user = await prisma.account.findFirst({ where: { email } });
    if (!user || !user.email || !user.emailConfirmed) {
      return ok(null);
    }

    const stamp = user.securityStamp ?? "";
    const token = await signToken(
      { sub: user.id, kind: "password-reset", email: user.email, stamp },
      RESET_TTL_SECONDS,
    );
    const origin = process.env.APP_ORIGIN ?? new URL(req.url).origin;
    const link = `${origin.replace(/\/+$/, "")}/Account/ResetPassword?token=${encodeURIComponent(
      token,
    )}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      textBody: `A password reset was requested for your InTalentMatch account.\n\n${link}\n\nLink expires in 1 hour. If you did not request this, ignore this email.`,
    });

    return ok(null);
  });
}
