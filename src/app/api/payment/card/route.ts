import type { NextRequest } from "next/server";
import { badRequest, ok, withErrorHandler } from "@/lib/http";
import { requireAccountId } from "@/lib/session";
import { addCard } from "@/lib/services/payment";
import { readForm } from "@/lib/reqparse";

const cardNumberRegex = /^[0-9 -]{13,19}$/;
const expiryRegex = /^(0\d|1[0-2])\/\d\d$/;
const cvvRegex = /^\d{3}$/;

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const accountId = await requireAccountId();
    const form = await readForm(req);
    const number = form.get("number");
    const expiry = form.get("expiry");
    const cvv = form.get("cvv");
    const name = form.get("name");

    if (!number || !cardNumberRegex.test(number)) return badRequest("Invalid card number.");
    if (!expiry || !expiryRegex.test(expiry)) return badRequest("Invalid expiry.");
    if (!cvv || !cvvRegex.test(cvv)) return badRequest("Invalid CVV.");
    if (!name) return badRequest();

    const result = await addCard(accountId, { number, expiry, cvv, name });
    return ok(result);
  });
}
