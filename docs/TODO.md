# ContractorCalc — TODO List

Prioritized backlog. Check items off as completed. Each section maps to a development session.

---

## Completed — MVP (Sessions 1–4)

### PDF Generation
- [x] Create quote PDF template with `@react-pdf/renderer`
- [x] Include: company header, customer info, materials table, pricing breakdown, terms
- [x] "Download PDF" button on quote detail page
- [x] "Generate & Save" action stores PDF URL on the quote record
- [x] Mobile-friendly PDF layout (contractors show these to clients on-site)
- [x] Company logo in PDF header

### Email Quotes
- [x] Set up Resend integration (`src/lib/email.ts`)
- [x] "Email Quote" button on quote detail page with email dialog
- [x] Email template: professional HTML with PDF attachment
- [x] Track `sentAt` timestamp on quote (auto-updates status to "sent")

### Stripe Subscriptions
- [x] Create Stripe products: Free, Pro ($29/mo), Business ($49/mo)
- [x] Billing page (`/settings/billing`)
- [x] Checkout flow (Stripe Checkout Session)
- [x] Webhook handler for subscription events
- [x] Enforce free tier limit (5 quotes/mo) — UI usage indicator + blocking card
- [x] 14-day free trial (no credit card required)
- [x] Subscription status badge in dashboard (UsageIndicator component)

---

## Completed — Polish & Deploy (Sessions 5–8)

### Vultr Production Deployment
- [x] Provision Vultr VPS ($6/mo plan)
- [x] Run `deploy/vultr-setup.sh`
- [x] Configure production `.env`
- [x] Point domain DNS to Vultr IP
- [x] Set up SSL with Certbot
- [x] Add GitHub Secrets for CI/CD
- [x] Verify auto-deploy pipeline works end-to-end
- [x] Set up PM2 monitoring

### GitHub Repository
- [x] Create GitHub repo (https://github.com/portofcams/contractor-tool)
- [x] Push all code (100 files, 19k lines)
- [x] Add `.env` to secrets
- [x] Verify CI/CD pipelines run

### Customer Portal
- [x] Public quote view page (no login required, unique URL)
- [x] "Accept" / "Decline" buttons for customers
- [x] Digital signature capture
- [x] Automatic status update on accept/decline
- [x] Email notification to contractor on accept/decline

### Landing Page
- [x] Marketing page at `/landing` for non-authenticated users
- [x] Pricing table (Free/Pro/Business)
- [x] Feature highlights (6 cards)
- [x] CTA → signup
- [x] Testimonials section
- [x] Root `/` redirects auth→dashboard, unauth→landing

### Settings Page
- [x] Company profile (name, phone, trade)
- [x] Default markup percentage
- [x] Custom material pricing
- [x] Trade preferences
- [x] Company logo upload
- [x] Notification preferences (accept/decline toggles)
- [x] Account deletion (cascades all data)

### Dashboard Enhancements
- [x] Charts: monthly quote volume, revenue over time, status breakdown, revenue by trade
- [x] Win/loss rate by trade type
- [x] Average quote value trends
- [x] Top customers by revenue
- [x] Exportable reports (CSV)

### Quote Templates
- [x] Save quote as template
- [x] Apply template to new quotes (pre-fill materials + pricing)
- [x] Default templates per trade type

### Floor Plan Upload & Processing
- [x] File upload component with drag & drop
- [x] Support PDF and image uploads (JPEG, PNG, WebP, PDF up to 10MB)
- [x] Store file URL and metadata in FloorPlan table
- [x] Image preview in quote creator

---

## Completed — Feature Expansion (Sessions 9–12)

### UX Improvements
- [x] Recolor app from amber/dark-gray to blue/indigo + slate
- [x] Streamlined quote creation (4 steps instead of 5)
- [x] Saved defaults for trade/material selections
- [x] "Create & Send" combined action
- [x] Inline customer creation from quote wizard
- [x] Duplicate existing quotes

### LiDAR Room Scanner
- [x] Swift Capacitor plugin using Apple RoomPlan API
- [x] Room dimension capture (length, width, height, floor/wall area)
- [x] Room scan CRUD API + UI

### Site Documentation
- [x] Site photos with before/after type tagging and filter tabs
- [x] Site notes CRUD
- [x] Voice notes with MediaRecorder recording, playback, magic-byte verification

### Job Management
- [x] Job calendar with full month view (ARIA grid roles)
- [x] Job status tracking (scheduled → in progress → completed → cancelled)
- [x] Crew assignment to jobs

### Invoicing
- [x] Invoice management with INV-0001 auto-numbering
- [x] Payment recording with partial/paid auto-status
- [x] Outstanding vs paid totals

### Team Management
- [x] Crew member CRUD with role/rate tracking
- [x] Active/inactive toggling, inline editing

### Additional Features
- [x] Quick estimate mode (`/quotes/quick` — sqft + trade → ballpark price)
- [x] Customer follow-up reminders with date picker and dismiss
- [x] Profit tracker (quoted vs actual cost comparison, category breakdown)
- [x] GPS auto-fill for customer addresses (browser geolocation + OpenStreetMap)
- [x] Multi-trade quotes (combine flooring + painting + drywall in one quote)

### Technical Quality
- [x] Unit tests for calculators, rate limiting, CSV export (3 test files, 291 lines)
- [x] Error boundary pages (`error.tsx` on dashboard routes)
- [x] Loading skeletons for server components
- [x] Rate limiting on API routes (auth 3/min, actions 10/min)
- [x] Database indexes (23 `@@index` declarations across all tables)
- [x] Pull-to-refresh component
- [x] Security hardening: IDOR fixes, enum validation, input length limits, magic-byte verification, cascade deletes
- [x] Accessibility: ARIA grid/live regions, label associations, focus management, semantic markup

---

## Still TODO

### iOS App Store Submission
- [ ] Test on iOS Simulator
- [ ] Test on physical device
- [ ] Design app icon (1024x1024)
- [ ] Add launch screen / splash assets
- [ ] Configure Xcode signing with Apple Developer account
- [ ] Take App Store screenshots (6.7", 6.1", iPad)
- [ ] Write App Store listing (title, subtitle, description, keywords)
- [ ] Submit for review

### GitHub
- [ ] Set up branch protection on `main`

### Remaining Features
- [ ] Quote view tracking (viewedAt field exists, needs tracking pixel or link logic)
- [ ] AI-powered dimension extraction from floor plans
- [ ] Floor plan storage on Cloudflare R2 (currently local/placeholder)

### Offline Improvements
- [ ] Conflict resolution UI (show conflicts, let user choose)
- [ ] Background sync via Capacitor Background Task plugin
- [ ] Delta sync (only changed records since last sync)
- [ ] Offline indicator in the UI (banner when offline)
- [ ] Queue status indicator (show pending sync count)

### Mobile Polish
- [ ] Swipe gestures on lists (swipe to delete, edit)
- [ ] Haptic feedback on key actions
- [ ] Camera integration: take photo of floor plan
- [ ] Share sheet: share quote PDF via iOS share

### Technical Debt
- [ ] API route tests (quotes, customers)
- [ ] E2E tests (Playwright — installed but no test files)
- [ ] React ErrorBoundary wrapper components
- [ ] Input sanitization middleware
- [ ] Accessibility audit (WCAG 2.1 — partial, needs full pass)
- [ ] Performance audit (Core Web Vitals)
