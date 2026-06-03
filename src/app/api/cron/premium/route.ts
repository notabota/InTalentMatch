import type { NextRequest } from "next/server";
import { ok, unauthorized, withErrorHandler } from "@/lib/http";
import { runPremiumExpiry } from "@/lib/services/premium-cron";

function authorize(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    throw new Error("CRON_SECRET environment variable must be set to run cron routes");
  }
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    if (!authorize(req)) return unauthorized();
    const result = await runPremiumExpiry();
    return ok({ status: "ok", ...result });
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
