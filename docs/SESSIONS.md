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

## Session 5 — Feb 28, 2026

### What was built
- **Company logo upload**: Upload logo in settings, integrated into PDF quote header; PDF color scheme updated from blue to amber
- **Testimonials**: New testimonials section on landing page
- **Loading skeletons**: Skeleton loading states for all 5 dashboard routes (dashboard, quotes, customers, templates, settings)
- **Error boundaries**: Error boundary components for all 5 dashboard routes
- **CSV export**: `GET /api/quotes/export` endpoint for CSV download of all quotes; export button on dashboard
- **Database indexes**: Migration adding indexes on frequently queried FK/filter columns for performance
- **Account deletion**: Password-confirmed account deletion in settings danger zone with `DELETE /api/settings/account` endpoint

### Files created/modified this session
```
NEW:
  prisma/migrations/20260228140000_add_indexes/migration.sql
  src/app/(dashboard)/customers/error.tsx
  src/app/(dashboard)/customers/loading.tsx
  src/app/(dashboard)/dashboard/error.tsx
  src/app/(dashboard)/dashboard/loading.tsx
  src/app/(dashboard)/quotes/error.tsx
  src/app/(dashboard)/quotes/loading.tsx
  src/app/(dashboard)/settings/delete-account.tsx
  src/app/(dashboard)/settings/error.tsx
  src/app/(dashboard)/settings/loading.tsx
  src/app/(dashboard)/templates/error.tsx
  src/app/(dashboard)/templates/loading.tsx
  src/app/api/quotes/export/route.ts
  src/app/api/settings/account/route.ts
  src/app/api/settings/logo/route.ts

MODIFIED:
  prisma/schema.prisma                          (added logo field + indexes)
  src/app/(dashboard)/dashboard/page.tsx        (CSV export button)
  src/app/(dashboard)/settings/page.tsx         (logo upload + danger zone)
  src/app/(dashboard)/settings/settings-form.tsx (logo upload UI)
  src/app/(marketing)/landing/page.tsx          (testimonials section)
  src/lib/pdf/quote-template.tsx                (logo in header, amber colors)
  src/lib/pdf/render.ts                         (logo support)
```

---

## Session 6 — Feb 28, 2026

### What was built
- **Rate limiting**: Token-bucket rate limiter (`src/lib/rate-limit.ts`) applied to signup, quote actions, email send, account delete
- **Notification preferences**: Toggle UI in settings with `GET/POST /api/settings` for email notification prefs
- **Quote view tracking**: Track when customers view quotes; activity timeline on quote detail page; `pdfUrl` field on Quote model
- **PDF saved to disk**: PDF generated and saved to filesystem with URL stored on quote record
- **Mobile-friendly PDF**: Larger fonts and padding for mobile readability
- **Pull-to-refresh**: `PullToRefresh` component integrated on all dashboard pages
- **Offline detection banner**: `OfflineBanner` component shows when device is offline
- **Default trade templates**: `POST /api/templates/defaults` loads 5 pre-built trade templates (general, electrical, plumbing, painting, flooring); "Load Defaults" button on templates page
- **Top customers widget**: Revenue-ranked customer list on dashboard
- **Unit tests**: 27 tests with Vitest — calculators (flooring, paint, drywall), rate limiter, CSV export
- **Input sanitization**: Locked PATCH fields, email validation, HTML escaping in emails, file extension whitelist, signature size limit, template validation
- **Accessibility**: `aria-current` on nav links, `scope` on table headers, `aria-hidden` on decorative SVGs, keyboard-accessible floor plan upload, `focus-visible` outlines, star rating labels

### Files created/modified this session
```
NEW:
  prisma/migrations/20260228155200_add_pdf_url/migration.sql
  src/app/(dashboard)/settings/notification-prefs.tsx
  src/app/(dashboard)/templates/load-defaults.tsx
  src/app/api/settings/route.ts
  src/app/api/templates/defaults/route.ts
  src/components/offline-banner.tsx
  src/components/pull-to-refresh.tsx
  src/lib/calculators.test.ts
  src/lib/csv-export.test.ts
  src/lib/rate-limit.test.ts
  src/lib/rate-limit.ts

MODIFIED:
  package.json                                  (added vitest)
  prisma/schema.prisma                          (added pdfUrl field)
  src/app/(dashboard)/dashboard/page.tsx        (top customers widget)
  src/app/(dashboard)/layout.tsx                (pull-to-refresh + offline banner)
  src/app/(dashboard)/quotes/[id]/page.tsx      (view tracking timeline)
  src/app/(dashboard)/settings/page.tsx         (notification prefs)
  src/app/(dashboard)/templates/page.tsx        (load defaults button)
  src/app/(marketing)/landing/page.tsx          (minor fix)
  src/app/api/auth/signup/route.ts              (rate limit)
  src/app/api/floorplans/route.ts               (file extension whitelist)
  src/app/api/quote/[token]/route.ts            (view tracking)
  src/app/api/quotes/[id]/pdf/route.ts          (save PDF to disk)
  src/app/api/quotes/[id]/route.ts              (locked fields)
  src/app/api/quotes/[id]/send/route.ts         (rate limit)
  src/app/api/settings/account/route.ts         (rate limit)
  src/app/api/settings/logo/route.ts            (file extension whitelist)
  src/app/api/templates/route.ts                (template validation)
  src/app/quote/[token]/page.tsx                (view tracking)
  src/components/floor-plan-upload.tsx           (keyboard a11y)
  src/components/layout/mobile-nav.tsx          (aria-current)
  src/components/layout/sidebar.tsx             (aria-current)
  src/lib/email.ts                              (HTML escaping)
  src/lib/pdf/quote-template.tsx                (mobile-friendly sizing)
```

---

## Session 7 — Feb 28, 2026

### What was built
- **Full app recolor**: Replaced amber-500 accent and custom dark hex backgrounds with blue-500/indigo accent and Tailwind slate palette across all 20 files — globals.css theme variables, landing page, sidebar, mobile nav, dashboard, charts, quote pages, billing, settings, auth pages, email templates, and PDF template

### Files modified this session
```
MODIFIED:
  src/app/(auth)/login/page.tsx
  src/app/(auth)/signup/page.tsx
  src/app/(dashboard)/dashboard/charts.tsx
  src/app/(dashboard)/dashboard/page.tsx
  src/app/(dashboard)/quotes/[id]/page.tsx
  src/app/(dashboard)/quotes/new/page.tsx
  src/app/(dashboard)/settings/billing/page.tsx
  src/app/(dashboard)/settings/notification-prefs.tsx
  src/app/(marketing)/landing/page.tsx
  src/app/globals.css
  src/app/quote/[token]/customer-actions.tsx
  src/app/quote/[token]/page.tsx
  src/components/floor-plan-upload.tsx
  src/components/layout/mobile-nav.tsx
  src/components/layout/sidebar.tsx
  src/components/offline-banner.tsx
  src/components/pull-to-refresh.tsx
  src/components/usage-indicator.tsx
  src/lib/email.ts
  src/lib/pdf/quote-template.tsx
```

---

## Session 8 — Feb 28, 2026

### What was built
- **Quote creation streamlined**: Reduced from 5 steps to 4 by merging review + create into a single step
- **Saved defaults**: `defaultTaxRate` and `defaultLaborCost` fields on Contractor model; auto-applied (markup, tax, labor, trade) when creating new quotes
- **"Create & Send" button**: One-tap quote creation + email send
- **Inline customer add**: Modal to add a new customer without navigating away from the quote wizard
- **Duplicate quote**: "Duplicate" button on quote detail to clone materials/pricing into a new quote
- **Settings fields**: Tax rate and labor cost fields added to settings page

### Files created/modified this session
```
NEW:
  prisma/migrations/20260228200000_default_tax_labor/migration.sql

MODIFIED:
  prisma/schema.prisma                              (defaultTaxRate, defaultLaborCost)
  src/app/(dashboard)/quotes/[id]/actions.tsx       (duplicate button)
  src/app/(dashboard)/quotes/new/page.tsx           (4-step wizard, defaults, create & send, inline customer)
  src/app/(dashboard)/settings/page.tsx             (tax + labor fields)
  src/app/(dashboard)/settings/settings-form.tsx    (tax + labor inputs)
  src/app/api/settings/route.ts                     (save defaults)
  src/app/api/usage/route.ts                        (minor)
```

---

## Session 9 — Mar 1, 2026

### What was built
- **LiDAR room scanner**: Native Capacitor Swift plugin wrapping Apple RoomPlan API (iOS 16+); auto-fills room dimensions in quote wizard step 2; `src/lib/room-scanner.ts` bridge + `ios/App/App/RoomScannerPlugin.swift` (283 lines)
- **Site photos**: Upload/view job site photos on quote and customer detail pages with captions and lightbox gallery; `POST /api/site-photos` endpoint
- **Site notes**: Create/edit/delete text notes attached to quotes and customers; `POST/PATCH/DELETE /api/site-notes` endpoint
- **Offline mode (enhanced)**: Detect offline state, save quotes to local storage via `offlineStore`, queue for sync on reconnect, enhanced offline banner with sync status and manual sync trigger
- **New Prisma models**: `RoomScan`, `SitePhoto`, `SiteNote` with full relations
- **iOS permissions**: Camera and photo library usage descriptions in `Info.plist`

### Files created/modified this session
```
NEW:
  ios/App/App/RoomScannerPlugin.swift
  prisma/migrations/20260301_room_photo_note/migration.sql
  src/app/api/room-scans/route.ts
  src/app/api/site-notes/route.ts
  src/app/api/site-photos/route.ts
  src/components/site-notes.tsx
  src/components/site-photos.tsx
  src/lib/room-scanner.ts

MODIFIED:
  ios/App/App/AppDelegate.swift                 (plugin registration)
  ios/App/App/Info.plist                        (camera + photo library permissions)
  prisma/schema.prisma                          (RoomScan, SitePhoto, SiteNote models)
  src/app/(dashboard)/customers/[id]/page.tsx   (site photos + notes sections)
  src/app/(dashboard)/quotes/[id]/page.tsx      (site photos + notes sections)
  src/app/(dashboard)/quotes/new/page.tsx       (LiDAR scanner in step 2)
  src/components/offline-banner.tsx             (sync status + manual trigger)
```

---

## Session 10 — Mar 1, 2026

### What was built
- **Security hardening**:
  - Fixed IDOR: validate `customerId`/`quoteId` ownership in all POST handlers (room-scans, site-photos, site-notes)
  - Fixed file upload bypass: verify magic bytes, use strict extension map, clean up orphaned files on DB failure
  - Input validation: room data shape validation, content length limits, JSON parse error handling
  - Wrapped all Prisma calls in try/catch with proper error responses
- **Accessibility fixes**:
  - `aria-live` regions for status announcements (photo upload, notes save)
  - Focus trap + Escape key handler for photo lightbox
  - `aria-labels` on all interactive elements (inputs, buttons, photo grid)
  - `role="progressbar"` on quote wizard step indicator
  - `role="alert"` on error messages
  - Color contrast fixes on offline banner (blue-700, green-700)
  - Semantic `<ul>/<li>` markup for notes list

### Files modified this session
```
MODIFIED:
  src/app/(dashboard)/quotes/new/page.tsx    (progressbar role, step a11y)
  src/app/api/room-scans/route.ts            (IDOR check, input validation, try/catch)
  src/app/api/site-notes/route.ts            (IDOR check, length limits, try/catch)
  src/app/api/site-photos/route.ts           (IDOR check, magic bytes, cleanup, try/catch)
  src/components/offline-banner.tsx           (contrast fix)
  src/components/site-notes.tsx              (aria-live, semantic lists, aria-labels)
  src/components/site-photos.tsx             (focus trap, lightbox a11y, aria-labels)
```

---

## Session 11 — Mar 1, 2026

### What was built
- **Jobs calendar**: `/jobs` page with month-view calendar, job creation/editing, status tracking (scheduled/in-progress/completed), click-to-view detail panel
- **Invoices**: `/invoices` page with payment tracking, status filters (draft/sent/paid/overdue), create from quote, mark as paid; `GET/POST /api/invoices`, `PATCH /api/invoices/[id]`
- **Team management**: `/team` page with crew member CRUD, role assignment, job assignment tracking; `GET/POST /api/crew`
- **Quick estimate**: `/quotes/quick` ballpark estimator — select trade, enter square footage, get instant price range without full quote wizard
- **Voice notes**: Audio recorder component with playback, attach voice memos to quotes; `POST /api/voice-notes` with file upload
- **Follow-up manager**: Schedule and track follow-ups on quotes (call, email, visit); `GET/POST /api/follow-ups`; integrated on quote detail page
- **Profit tracker**: `ProfitTracker` component comparing quoted vs actual costs per job, margin analysis
- **GPS auto-fill**: Browser geolocation to auto-fill address in quote wizard
- **Multi-trade quotes**: Support for multiple trades in a single quote (e.g., flooring + painting)
- **Before/after photos**: Photo type filter (before/during/after) on site photos component

### New Prisma models
`Job`, `Invoice`, `ActualCost`, `CrewMember`, `JobAssignment`, `VoiceNote`, `FollowUp`

### Files created/modified this session
```
NEW:
  prisma/migrations/20260301_jobs_invoices_crew/migration.sql
  src/app/(dashboard)/invoices/page.tsx
  src/app/(dashboard)/jobs/page.tsx
  src/app/(dashboard)/quotes/quick/page.tsx
  src/app/(dashboard)/team/page.tsx
  src/app/api/crew/route.ts
  src/app/api/follow-ups/route.ts
  src/app/api/invoices/[id]/route.ts
  src/app/api/invoices/route.ts
  src/app/api/jobs/[id]/route.ts
  src/app/api/jobs/route.ts
  src/app/api/voice-notes/route.ts
  src/components/follow-up-manager.tsx
  src/components/profit-tracker.tsx
  src/components/voice-recorder.tsx

MODIFIED:
  prisma/schema.prisma                          (7 new models)
  src/app/(dashboard)/customers/[id]/page.tsx   (minor)
  src/app/(dashboard)/quotes/[id]/page.tsx      (voice notes + follow-ups)
  src/app/(dashboard)/quotes/new/page.tsx       (GPS + multi-trade)
  src/app/api/site-photos/route.ts              (before/after type)
  src/components/layout/sidebar.tsx             (Jobs, Invoices, Team nav links)
  src/components/site-photos.tsx                (type filter + before/after)
```

---

## Session 12 — Mar 1, 2026

### What was built
- **Security hardening for 10 new features**:
  - Status enum validation on follow-ups, invoices, and jobs API routes
  - IDOR check on `customerId` in quotes POST
  - Magic-byte verification on voice-notes file upload
  - Input length limits on crew member fields
  - Complete account deletion cascade — added all new tables (Job, Invoice, CrewMember, VoiceNote, FollowUp, etc.) to cascade delete
- **Accessibility fixes for 10 new features**:
  - ARIA grid roles on jobs calendar
  - `htmlFor`/`id` on all form labels (team page, quick estimate)
  - `DialogDescription` for modal dialogs
  - `aria-live` status regions on jobs, invoices, and team pages
  - Focus management on job detail panel
  - `aria-pressed` on photo filter buttons
  - Color contrast fixes
  - Semantic `<ul>/<li>` markup for crew member list
  - `aria-label` on sidebar nav

### Files modified this session
```
MODIFIED:
  src/app/(dashboard)/invoices/page.tsx        (aria-live, status validation)
  src/app/(dashboard)/jobs/page.tsx            (ARIA grid, focus management, aria-live)
  src/app/(dashboard)/quotes/quick/page.tsx    (htmlFor/id labels)
  src/app/(dashboard)/team/page.tsx            (labels, semantic lists, DialogDescription)
  src/app/api/crew/route.ts                    (input length limits)
  src/app/api/follow-ups/route.ts              (status enum validation)
  src/app/api/invoices/[id]/route.ts           (status enum validation)
  src/app/api/jobs/[id]/route.ts               (status enum validation)
  src/app/api/quotes/route.ts                  (IDOR check on customerId)
  src/app/api/settings/account/route.ts        (cascade delete new tables)
  src/app/api/voice-notes/route.ts             (magic-byte verification)
  src/components/layout/sidebar.tsx            (aria-label)
  src/components/profit-tracker.tsx            (minor)
  src/components/site-photos.tsx               (aria-pressed)
```

---

## Starting a New Session

When resuming work, check:
1. `docs/TODO.md` for the prioritized task list
2. `docs/SESSIONS.md` for what was done last
3. Run `npm run dev` to verify the app starts
4. Run `brew services list` to check PostgreSQL is running
