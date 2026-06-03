import { ok } from "@/lib/http";
import { getCategories } from "@/lib/services/category";

export async function GET() {
  const result = await getCategories();
  return ok(result);
}
