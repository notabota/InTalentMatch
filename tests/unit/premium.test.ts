import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { calculatePremiumPrice, calculateTransactionFee } from "@/lib/premium";

describe("calculatePremiumPrice", () => {
  const originalDomain = process.env.PROMO_EMAIL_DOMAIN;

  afterAll(() => {
    process.env.PROMO_EMAIL_DOMAIN = originalDomain;
  });

  it("returns the standard price when no promo domain is configured", () => {
    process.env.PROMO_EMAIL_DOMAIN = "";
    expect(calculatePremiumPrice({ email: "anyone@example.com", isPremium: false })).toBe(8.99);
  });

  it("returns the standard price for emails not matching the promo domain", () => {
    process.env.PROMO_EMAIL_DOMAIN = ".promo.test";
    expect(calculatePremiumPrice({ email: "anyone@example.com", isPremium: false })).toBe(8.99);
  });

  it("returns the discounted price for matching email suffix", () => {
    process.env.PROMO_EMAIL_DOMAIN = ".promo.test";
    expect(calculatePremiumPrice({ email: "vip@x.promo.test", isPremium: false })).toBe(2.91);
  });

  it("handles null email gracefully", () => {
    process.env.PROMO_EMAIL_DOMAIN = ".promo.test";
    expect(calculatePremiumPrice({ email: null, isPremium: false })).toBe(8.99);
  });
});

describe("calculateTransactionFee", () => {
  it("charges 10% for non-Premium providers", () => {
    expect(calculateTransactionFee({ isPremium: false }, 100)).toBeCloseTo(10);
  });

  it("charges 0% for Premium providers", () => {
    expect(calculateTransactionFee({ isPremium: true }, 100)).toBe(0);
  });

  it("scales linearly with the value", () => {
    expect(calculateTransactionFee({ isPremium: false }, 250)).toBeCloseTo(25);
  });
});
