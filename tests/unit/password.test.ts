import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, validatePasswordPolicy } from "@/lib/password";

describe("password policy", () => {
  it("accepts passwords of 8 or more characters", () => {
    expect(validatePasswordPolicy("12345678")).toBeNull();
    expect(validatePasswordPolicy("a-much-longer-password")).toBeNull();
  });

  it("rejects passwords shorter than 8 characters", () => {
    expect(validatePasswordPolicy("short")).toMatch(/8 characters/);
    expect(validatePasswordPolicy("")).toMatch(/8 characters/);
  });
});

describe("hash and verify", () => {
  it("verifies a hash against its original password", async () => {
    const hash = await hashPassword("correct-horse-battery-staple");
    expect(await verifyPassword("correct-horse-battery-staple", hash)).toBe(true);
  });

  it("rejects a wrong password against a hash", async () => {
    const hash = await hashPassword("first-password");
    expect(await verifyPassword("second-password", hash)).toBe(false);
  });

  it("produces different hashes for the same password (salt)", async () => {
    const a = await hashPassword("same-password");
    const b = await hashPassword("same-password");
    expect(a).not.toBe(b);
  });
});
