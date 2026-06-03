import { describe, it, expect, beforeAll } from "vitest";
import { signToken, verifyToken } from "@/lib/tokens";

beforeAll(() => {
  process.env.AUTH_SECRET = "test-secret-must-be-at-least-32-characters-long";
});

describe("signToken and verifyToken", () => {
  it("roundtrips a password-reset token", async () => {
    const token = await signToken(
      { sub: "user-1", kind: "password-reset", email: "alice@example.com", stamp: "stamp-1" },
      3600,
    );
    const payload = await verifyToken(token, "password-reset");
    expect(payload.sub).toBe("user-1");
    expect(payload.email).toBe("alice@example.com");
    expect(payload.stamp).toBe("stamp-1");
  });

  it("rejects a token verified under the wrong kind", async () => {
    const token = await signToken(
      { sub: "user-1", kind: "email-confirm", email: "alice@example.com", stamp: "stamp-1" },
      3600,
    );
    await expect(verifyToken(token, "password-reset")).rejects.toThrow(/kind/);
  });

  it("rejects an expired token", async () => {
    const token = await signToken(
      { sub: "user-1", kind: "email-confirm", email: "alice@example.com", stamp: "stamp-1" },
      -1,
    );
    await expect(verifyToken(token, "email-confirm")).rejects.toThrow();
  });

  it("throws when AUTH_SECRET is too short", async () => {
    const original = process.env.AUTH_SECRET;
    process.env.AUTH_SECRET = "too-short";
    await expect(
      signToken({ sub: "u", kind: "email-confirm", email: "x@y", stamp: "" }, 60),
    ).rejects.toThrow();
    process.env.AUTH_SECRET = original;
  });
});
