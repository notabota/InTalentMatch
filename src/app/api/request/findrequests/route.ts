import type { NextRequest } from "next/server";
import { ok, withErrorHandler } from "@/lib/http";
import { findRequests } from "@/lib/services/request";
import { getRequestCategories } from "@/lib/services/category";

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const keywords = req.nextUrl.searchParams.get("keywords") ?? undefined;
    const categoryIds = req.nextUrl.searchParams.getAll("categoryId");
    const location = req.nextUrl.searchParams.get("location") ?? undefined;

    const requests = await findRequests({
      keywords,
      categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
      location,
      isCompleted: false,
    });

    for (const r of requests) {
      r.categories = await getRequestCategories(r.id);
    }

    return ok(requests);
  });
}
