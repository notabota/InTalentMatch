import { NextResponse } from "next/server";
import { SessionExpiredError } from "@/lib/session";
import { ErrorStrings } from "@/lib/errors";

export function badRequest(error?: string) {
  return NextResponse.json(error ?? null, { status: 400 });
}

export function unauthorized(error?: string) {
  return NextResponse.json(error ?? null, { status: 401 });
}

export function notFound() {
  return NextResponse.json(null, { status: 404 });
}

export function ok<T>(data: T) {
  return NextResponse.json(data, { status: 200 });
}

export async function withErrorHandler<T>(
  fn: () => Promise<T>,
): Promise<T | NextResponse> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof SessionExpiredError) {
      return badRequest(ErrorStrings.SessionExpired);
    }
    console.error(err);
    return badRequest(ErrorStrings.ErrorTryAgain);
  }
}
