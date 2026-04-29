import { ok } from "@/lib/http";

export async function GET() {
  return ok({
    ok: true,
    time: new Date().toISOString(),
    version: process.env.npm_package_version ?? "0.0.0",
  });
}

export const dynamic = "force-dynamic";
