import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
};

const sentryEnabled = !!process.env.SENTRY_DSN;

export default sentryEnabled
    ? withSentryConfig(nextConfig, {
          silent: true,
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          tunnelRoute: "/monitoring",
          disableLogger: true,
      })
    : nextConfig;
