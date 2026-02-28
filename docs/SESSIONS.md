# ContractorCalc — Session Log

Tracks what was built in each development session for continuity.

---

## Session 1 — Feb 27, 2026

### What was built
- **Project initialized**: Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Database**: PostgreSQL 17 installed, `contractor_tool` DB created, Prisma 6 schema with 5 models
- **Auth**: NextAuth.js with credentials provider (email/password), JWT sessions
- **Customer CRUD**: List, create, detail pages + API route
- **Material calculators**: Flooring (5 materials, 3 patterns, waste factors), paint (3 types, multi-coat), drywall (3 sheet sizes + mud + tape)
- **Quote creator**: 5-step wizard (select customer → room dimensions → trade/material → calculate/price → confirm)
- **Quote management**: List page, detail page, status actions (draft/sent/accepted/rejected)
- **Dashboard**: Stats cards (total quotes, win rate, revenue, customers) + recent quotes
- **Layout**: Desktop sidebar + mobile bottom nav, auth-protected routes
- **Seed data**: 13 default material costs loaded

### What was set up
- PostgreSQL 17 via Homebrew (`brew services start postgresql@17`)
- Database migration applied (`20260228083230_init`)
- All 15 routes building cleanly

---

## Session 2 — Feb 27, 2026

### What was built
- **Capacitor iOS app**: Native shell with 7 plugins (camera, filesystem, preferences, network, splash screen, status bar, app lifecycle)
- **Offline storage layer**: `offline-storage.ts` — local persistence for customers, quotes, files via Capacitor Preferences with web localStorage fallback
- **Sync service**: `sync-service.ts` — push (local→server), pull (server→local), auto-sync on network reconnect, session logging
- **Capacitor init**: `capacitor-init.ts` + `capacitor-provider.tsx` — bootstraps native plugins on app launch
- **GitHub Actions CI/CD**:
  - `deploy.yml` — lint → typecheck → build → SSH deploy to Vultr on push to main
  - `ios-build.yml` — verify iOS Xcode build compiles on PR/push
- **Vultr deployment**:
  - `vultr-setup.sh` — one-command VPS provisioning (Node, PostgreSQL, Nginx, PM2, SSL)
  - `env.production.example` — production env template
- **Documentation**:
  - `ARCHITECTURE.md` — full system diagram, tech stack table, data flow, business rules
  - `docs/IOS-APP.md` — iOS app guide, offline flow, native plugin usage, App Store build
  - `docs/DEPLOYMENT.md` — local dev, GitHub setup, Vultr setup, monitoring, scaling
  - `docs/SESSIONS.md` — this file

### Architecture decisions
- **Server-rendered iOS app** (not static export): The Capacitor app loads from the deployed server, same pattern as portofcams. This means web changes deploy instantly without App Store updates. Native plugins still work via Capacitor bridge.
- **Prisma 6** (not 7): v7's adapter-based client was unnecessarily complex for this project. v6's `prisma-client-js` generator works out of the box.
- **Offline-first with sync queue**: Data is written locally first, then synced when online. Sync queue is persistent across app restarts.

### Files created/modified this session
```
NEW:
  capacitor.config.ts
  ios/                           (Capacitor iOS project)
  src/lib/offline-storage.ts
  src/lib/sync-service.ts
  src/lib/capacitor-init.ts
  src/components/capacitor-provider.tsx
  .github/workflows/deploy.yml
  .github/workflows/ios-build.yml
  deploy/vultr-setup.sh
  deploy/env.production.example
  ARCHITECTURE.md
  docs/IOS-APP.md
  docs/DEPLOYMENT.md
  docs/SESSIONS.md
  docs/TODO.md

MODIFIED:
  next.config.ts                 (image config)
  package.json                   (iOS + deploy scripts)
  src/app/layout.tsx             (added CapacitorProvider)
```

---

## Session 3 — Feb 27, 2026

### What was built
- **Quote PDF generation**: Professional PDF template using `@react-pdf/renderer` with company header, customer info, materials table, pricing breakdown (subtotal/markup/labor/tax/total), terms & conditions footer
- **PDF API route**: `GET /api/quotes/[id]/pdf` — renders and returns PDF as downloadable file
- **Email service**: `src/lib/email.ts` — Resend integration with professional HTML email template, PDF attachment, dev-mode console logging when no API key
- **Email API route**: `POST /api/quotes/[id]/send` — generates PDF, emails to customer, auto-updates quote status to "sent" with timestamp
- **UI actions**: Download PDF button + Email Quote button with dialog (pre-fills customer email, shows success/error feedback)

### Smoke test results
- PDF generation: valid PDF (4,110 bytes, version 1.3, 1 page)
- Email endpoint: returns `{"success":true,"sentTo":"john@homeowner.com"}`
- Quote status auto-updated from `draft` → `sent` with `sentAt` timestamp
- Full build: 17 routes, all clean

### Files created/modified this session
```
NEW:
  src/lib/pdf/quote-template.tsx    (PDF layout with react-pdf)
  src/lib/pdf/render.ts             (server-side PDF render utility)
  src/lib/email.ts                  (Resend email service)
  src/app/api/quotes/[id]/pdf/route.ts   (PDF download endpoint)
  src/app/api/quotes/[id]/send/route.ts  (Email send endpoint)

MODIFIED:
  src/app/(dashboard)/quotes/[id]/actions.tsx  (added PDF + email buttons)
  src/app/(dashboard)/quotes/[id]/page.tsx     (pass customerEmail to actions)
```

---

## Session 4 — Feb 27, 2026

### What was built
- **Stripe integration**: `src/lib/stripe.ts` — lazy `getStripe()` initialization, plan definitions (Free/Pro $29/Business $49), usage helpers (`getPlan`, `getQuotesRemaining`, `isAtQuoteLimit`)
- **Checkout API**: `POST /api/stripe/checkout` — creates Stripe Checkout Session with 14-day free trial, reuses existing `stripeCustomerId`
- **Billing Portal API**: `POST /api/stripe/portal` — creates Billing Portal session for subscription management
- **Webhook handler**: `POST /api/stripe/webhook` — handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`; includes `determinePlanFromSubscription()` fallback for Dashboard-initiated plan changes
- **Billing page**: `/settings/billing` — current plan display with usage bar, success/canceled banners, plan comparison grid (Free/Pro/Business) with feature lists
- **Billing actions component**: Client component with upgrade buttons (Pro/Business) and manage subscription button (Billing Portal)
- **Usage indicator**: Reusable `UsageIndicator` component — color-coded progress bar (blue/yellow/red), upgrade CTA at limit
- **Usage API**: `GET /api/usage` — returns plan info and quotes-this-month for client components
- **Dashboard integration**: `UsageIndicator` added below stats cards on dashboard
- **Quote limit enforcement**: New quote page fetches `/api/usage` on mount, shows blocking card when at limit, shows remaining quotes count for free tier

### Issues resolved
- **Stripe apiVersion mismatch**: `"2025-04-30.basil"` incompatible with SDK's `"2026-02-25.clover"` — removed explicit version, let SDK use default
- **Stripe crashes on empty key**: `new Stripe("")` throws at module load. Refactored to lazy `getStripe()` function, updated 3 consumer files
- Build: **22 routes, all clean**

### Files created/modified this session
```
NEW:
  src/lib/stripe.ts                          (Stripe SDK + plan definitions)
  src/app/api/stripe/checkout/route.ts       (Checkout Session endpoint)
  src/app/api/stripe/portal/route.ts         (Billing Portal endpoint)
  src/app/api/stripe/webhook/route.ts        (Webhook handler)
  src/app/(dashboard)/settings/billing/page.tsx    (Billing page)
  src/app/(dashboard)/settings/billing/actions.tsx (Billing actions)
  src/components/usage-indicator.tsx          (Usage display component)
  src/app/api/usage/route.ts                 (Usage API)

MODIFIED:
  src/components/layout/sidebar.tsx           (added Billing nav item)
  src/app/(dashboard)/page.tsx                (added UsageIndicator)
  src/app/(dashboard)/quotes/new/page.tsx     (added limit blocker + remaining count)
  .env                                        (added Stripe env vars)
```

---

## Starting a New Session

When resuming work, check:
1. `docs/TODO.md` for the prioritized task list
2. `docs/SESSIONS.md` for what was done last
3. Run `npm run dev` to verify the app starts
4. Run `brew services list` to check PostgreSQL is running
