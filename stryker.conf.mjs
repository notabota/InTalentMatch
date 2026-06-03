/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: "npm",
  reporters: ["progress", "clean-text", "html"],
  testRunner: "vitest",
  vitest: {
    configFile: "vitest.config.ts",
  },
  coverageAnalysis: "perTest",
  mutate: [
    "src/lib/premium.ts",
    "src/lib/password.ts",
    "src/lib/tokens.ts",
    "src/lib/services/payment.ts",
  ],
  thresholds: { high: 80, low: 60, break: 50 },
};

export default config;
