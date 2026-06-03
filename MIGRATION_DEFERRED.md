# Migration Deferred Items

This document tracks .NET backend functionality that is **not** ported to the unified Next.js project in this migration pass. Each item lists its current home, why it was deferred, and the planned replacement path.

The Bucket A migration (entities, domain services, business API endpoints, email, notifications, premium pricing) lives in `src/app/api/**` and `src/lib/**`. Everything below stays in the .NET service for now and is reached via a Next.js rewrite proxy.

## 1. Account / Identity / OAuth

**Current home:** `InTalentMatch_Backend/InTalentMatch/Controllers/AccountController.cs`, `Identity/IdentityEmailSender.cs`, ASP.NET Identity via `IdentityDbContext<Account>`, `Program.cs` Identity + OAuth wiring.

**Endpoints not ported:**
- `GET  /api/Account` — current user
- `PATCH /api/Account` — update profile
- `POST /api/Account/Login`
- `POST /api/Account/Logout`
- `POST /api/Account/Register`
- `GET  /api/Account/ExternalLogin` (Google / Microsoft OAuth challenge)
- `GET  /api/Account/ExternalCallback`
- `POST /api/Account/ExternalRegister`
- `POST /api/Account/ResendEmailConfirmation`
- `POST /api/Account/ConfirmEmail`
- `POST /api/Account/ForgotPassword`
- `POST /api/Account/ResetPassword`

**Why deferred:** Tightly coupled to ASP.NET Identity (`UserManager`, `SignInManager`, `IUserStore`, `IUserEmailStore`), PBKDF2 password hashing, Identity-issued email confirmation / password reset tokens, OAuth (Google + Microsoft), cookie authentication scheme with anti-forgery, two-factor flow, lockout, external-login linking. No mechanical 1:1 mapping exists in Node; a port means re-implementing auth on Auth.js v5 or equivalent, plus a password rehash strategy on first login.

**Replacement plan:**
1. .NET backend continues to serve all `/api/Account/*` routes.
2. `next.config.mjs` adds a `rewrites()` rule forwarding `/api/Account/:path*` to the .NET origin.
3. Session cookie issued by .NET Identity remains the source of truth.
4. Next.js API routes resolve the calling account by forwarding incoming cookies to `GET {NET_BACKEND}/api/Account` and reading `id` from the JSON. See `src/lib/session.ts`.
5. Future cut-over: replace `src/lib/session.ts` with native Auth.js Credentials + OAuth providers, migrate password hashes lazily on next sign-in.

## 2. Premium Lifetime Background Service

**Current home:** `InTalentMatch_Backend/InTalentMatch/Background/PremiumLifetimeService.cs`

**What it does:** Hosted `BackgroundService` that wakes every UTC midnight, scans for providers whose `SubscriptionDate < now - 1 month`, attempts to re-bill via `PaymentService.Transfer`, and either renews the subscription or cancels it.

**Why deferred:** Next.js has no in-process long-running background worker. Options (Vercel Cron, external `node-cron`, a queue worker) are infrastructure changes orthogonal to the API port.

**Replacement plan:**
1. **Lazy expiry on read** (implemented now): `src/lib/services/profile.ts` `getProvider()` checks `isSubscriptionActive && subscriptionDate < now - 1 month` and downgrades the provider in-place before returning. Covers the common case where a stale premium provider is queried.
2. **Renewal re-billing** (still deferred): the daily renewal pass that re-charges providers and notifies them is not run. Until a cron worker is provisioned, premium subscriptions are effectively pay-once-per-period rather than auto-renewing.
3. Future cut-over: add a Vercel Cron route at `app/api/cron/premium/route.ts` that runs the full `DeactivateExpiredPremium` logic on a daily schedule.

## 3. Postmark Outbound Email

**Current home:** `InTalentMatch_Backend/InTalentMatch/Alerts/Email/{PostmarkEmailService,EmailMessageSender,PostmarkEmailServiceFactory}.cs`, `Identity/IdentityEmailSender.cs`.

**Status:** **Partially deferred.** The Postmark transport itself is portable (the `postmark` npm package exists), but in this pass outbound email is only triggered by the deferred Account flow (email confirmation, password reset). Notification-driven email (`EmailMessageSender` listening to `NotificationService.OnMessageSent`) is **not** wired in Next.js — in-app notifications are persisted, but the matching email copy is not sent.

**Why deferred:** The only consumers of email-on-notification are flows already deferred with Account/Identity. Wiring Postmark on day one without those callers is dead code.

**Replacement plan:** When Account is ported, add `src/lib/email.ts` wrapping the Postmark Node SDK and have `src/lib/notify.ts` fan out to email after writing the notification row.

## 4. ASP.NET Authorization Policy `InTalentMatchEmployee`

**Current home:** `Program.cs` — `policy.RequireAssertion(... ClaimTypes.Email endsWith "@{Admin:Domain}")`.

**Why deferred:** No controllers currently apply `[Authorize(Policy = "InTalentMatchEmployee")]`, so the policy is registered but unused. Defer until an admin surface is built.

**Replacement plan:** Plain middleware check `email.endsWith("@" + process.env.ADMIN_DOMAIN)` next to the route(s) that need it.

## 5. Swagger / OpenAPI

**Current home:** `Program.cs` `AddSwaggerGen` + `UseSwagger` + `UseSwaggerUI`.

**Why deferred:** Generator is `.NET`-specific. The ported Next.js routes are documented by their TypeScript types and `src/lib/services/*` signatures; no auto-generated UI is shipped.

**Replacement plan:** If an interactive doc surface is needed, add `@asteasolutions/zod-to-openapi` later and generate from the Zod request schemas already used by route handlers.

## 6. Static-File SPA Fallback

**Current home:** `Program.cs` lines 175–217 — request rewriting that maps `/foo` to `/foo.html` and `404` to `/404.html` against the .NET WebRoot.

**Why deferred:** This existed because the .NET app served the previously-exported Next.js bundle. In the unified project Next.js owns routing directly — this middleware becomes obsolete and is dropped, not ported.

## 7. `next.config.mjs` `output: 'export'`

**Status:** **Removed** as part of the migration. A static export cannot serve API route handlers, so the unified project runs in standard Next.js server mode. If a static bundle is still needed for a CDN drop, it must be produced from a separate build configuration.

## Summary

| Area | Status | Where it lives now |
|---|---|---|
| Entities (13) | Ported | `prisma/schema.prisma` |
| Category, Message, Notification, Payment, Profile, Request, Review services | Ported | `src/lib/services/*.ts` |
| 22 business API endpoints | Ported | `src/app/api/**/route.ts` |
| Premium price + transaction fee | Ported | `src/lib/premium.ts` |
| Lazy premium expiry on read | Ported | `src/lib/services/profile.ts` |
| Account / Identity / OAuth (12 endpoints) | **Deferred** — proxied to .NET | `InTalentMatch_Backend/.../AccountController.cs` |
| Premium daily renewal cron | **Deferred** | `InTalentMatch_Backend/.../PremiumLifetimeService.cs` |
| Email-on-notification fan-out | **Deferred** | `InTalentMatch_Backend/.../EmailMessageSender.cs` |
| `InTalentMatchEmployee` admin policy | **Deferred** (unused) | `InTalentMatch_Backend/.../Program.cs` |
| Swagger UI | **Dropped** | n/a |
| Static SPA fallback middleware | **Dropped** | n/a |
