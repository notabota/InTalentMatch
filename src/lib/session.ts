import { cookies } from "next/headers";

export const SESSION_COOKIE = "intalentmatch_account";

export async function getCurrentAccountId(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function requireAccountId(): Promise<string> {
  const id = await getCurrentAccountId();
  if (!id) {
    throw new SessionExpiredError();
  }
  return id;
}

export class SessionExpiredError extends Error {
  constructor() {
    super("Session expired.");
    this.name = "SessionExpiredError";
  }
}
