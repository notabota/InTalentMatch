export interface PremiumProvider {
  email?: string | null;
  isPremium: boolean;
}

export function calculatePremiumPrice(provider: PremiumProvider): number {
  const promoDomain = process.env.PROMO_EMAIL_DOMAIN;
  if (promoDomain && provider.email?.endsWith(promoDomain)) {
    return 2.91;
  }
  return 8.99;
}

export function calculateTransactionFee(provider: PremiumProvider, value: number): number {
  if (provider.isPremium) {
    return 0;
  }
  return value * 0.1;
}
