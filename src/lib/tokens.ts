import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET environment variable must be set to a string of at least 32 characters",
    );
  }
  return new TextEncoder().encode(secret);
}

export type TokenKind = "email-confirm" | "password-reset";

interface TokenPayload {
  sub: string;
  kind: TokenKind;
  email: string;
  stamp: string;
}

export async function signToken(
  payload: Omit<TokenPayload, "stamp"> & { stamp?: string },
  ttlSeconds: number,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({
    kind: payload.kind,
    email: payload.email,
    stamp: payload.stamp ?? "",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt(now)
    .setExpirationTime(now + ttlSeconds)
    .sign(getSecret());
}

export async function verifyToken(token: string, kind: TokenKind): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  if (payload.kind !== kind) {
    throw new Error("Token kind mismatch");
  }
  if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
    throw new Error("Token payload malformed");
  }
  return {
    sub: payload.sub,
    kind: payload.kind as TokenKind,
    email: payload.email as string,
    stamp: (payload.stamp as string | undefined) ?? "",
  };
}
