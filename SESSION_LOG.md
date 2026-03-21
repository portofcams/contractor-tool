# ContractorCalc — Session Log

## Session 1–5 (Pre-context, Feb 2026)
Built core app: Next.js 16 + Prisma + Capacitor iOS. Features include:
- Multi-trade quote calculator (flooring, painting, drywall)
- LiDAR room scanning via Apple RoomPlan
- Customer management with GPS address lookup
- PDF generation with @react-pdf/renderer
- Email delivery via Resend
- Stripe invoice payments
- Site photos, voice notes, site notes
- Follow-up reminders (manual + auto sequences)
- Offline support with sync queue
- Public quote page with accept/decline + signature
- Quote templates, duplication, CSV import/export
- Job scheduling, crew management, profit tracking
- Dashboard with charts, activity feed, onboarding checklist
- Google OAuth + credentials auth
- PWA support (manifest, service worker, icons)
- Dark/light theme toggle

## Session 6 (2026-03-04) — Server Migration + Audit + Plan Features
**Server migration:**
- Old server (45.77.120.186) was deleted during consolidation
- Set up fresh on new server: 144.202.116.229
- Docker: contractorcalc-app (port 8002) + contractorcalc-db (PostgreSQL 16)
- Applied full 17-table schema via raw SQL
- Domain: contract.portofcams.com (DNS + NPM + Let's Encrypt SSL)
- Google OAuth redirect URI updated

**Features implemented this session:**
- Task #31: Automated follow-up sequences (auto-create on send, auto-dismiss on accept/reject)
- Task #32: Online Stripe payments on customer portal
- Task #33: Photo markup/annotation (canvas-based draw/arrow/circle/text)
- Task #34: Production env template (.env.production.template)
- Task #35: Customer CSV import
- Task #36: Quote versioning with revision history

**Audit (continued session):**
- Full site test: signup, login, CRUD, public quote, cron, all passing
- Fixed: empty database (tables not applied), stale NEXTAUTH_URL
- PDF improvements: increased padding, status badge, company address, room dimensions
- App icon + splash screen: branded blue gradient "CC" design
- Deployed all changes to production

**Server details:**
- IP: 144.202.116.229 | SSH: root (key-based)
- App: contractorcalc-app (port 8002) | DB: contractorcalc-db
- DB: user=contractorcalc, db=contractor_tool
- Config: ~/server/contractorcalc/docker-compose.yml
- Env: ~/server/contractorcalc/.env
- Source: ~/server/contractorcalc/src/
- Networks: proxy-network (NPM), cc-internal (app↔db)
- Deploy: tar + scp + docker compose build + up

**Pending env vars:** STRIPE_*, RESEND_API_KEY, R2_*, ANTHROPIC_API_KEY

## Session 7 (2026-03-04) — Power Features: AI + AR + 3D + Before/After

**4 power features implemented:**

1. **Before/After Photo Slider** (Task #49) — COMPLETE
   - `src/components/before-after-slider.tsx` — draggable comparison slider using pointer events
   - `BeforeAfterSlider` for individual comparisons, `BeforeAfterGallery` for auto-pairing
   - Integrated into contractor quote detail + public quote page

2. **AI Photo → Quote** (Task #47) — COMPLETE
   - `src/app/api/quotes/ai-estimate/route.ts` — Claude Sonnet vision API analyzes room photos
   - `src/components/ai-estimate.tsx` — photo capture + analysis UI with material results
   - Trade-specific prompts (flooring/painting/drywall) with pricing guidelines
   - Integrated into new quote wizard Step 2 with "Use This Estimate" flow

3. **3D Room Walkthrough** (Task #48) — COMPLETE
   - `ios/App/App/RoomScannerPlugin.swift` — extended to export USDZ via `room.export()`
   - `src/components/room-3d-viewer.tsx` — Google model-viewer web component
   - `src/app/api/room-scans/route.ts` — USDZ upload + storage
   - `prisma/schema.prisma` — added `modelUrl` to RoomScan model
   - AR Quick Look on iOS, interactive 3D on web, download USDZ

4. **AR Material Preview** (Task #46) — COMPLETE
   - `ios/App/App/ARMaterialPreviewPlugin.swift` — ARKit plane detection + texture overlay
   - `src/lib/ar-material-preview.ts` — Capacitor plugin bridge + material libraries
   - `src/components/ar-material-preview.tsx` — launch button (auto-hides on non-AR devices)
   - 10 flooring materials + 10 paint colors, prev/next cycling, haptic feedback
   - Integrated into quote detail, public quote, and new quote wizard

**Files created:**
- `ios/App/App/ARMaterialPreviewPlugin.swift`
- `src/lib/ar-material-preview.ts`
- `src/components/ar-material-preview.tsx`
- `src/components/before-after-slider.tsx`
- `src/components/ai-estimate.tsx`
- `src/components/room-3d-viewer.tsx`
- `src/app/api/quotes/ai-estimate/route.ts`

**Files modified:**
- `ios/App/App/RoomScannerPlugin.swift` (USDZ export)
- `ios/App/App/BridgeViewController.swift` (register AR plugin)
- `src/lib/room-scanner.ts` (usdzBase64 field)
- `src/app/api/room-scans/route.ts` (USDZ upload)
- `src/app/(dashboard)/quotes/[id]/page.tsx` (3D viewer, before/after, AR preview)
- `src/app/(dashboard)/quotes/new/page.tsx` (AI estimate, AR preview, USDZ save)
- `src/app/quote/[token]/page.tsx` (3D viewer, before/after, AR preview, photos)
- `src/app/layout.tsx` (model-viewer script)
- `prisma/schema.prisma` (modelUrl on RoomScan)

**Pending for deployment:**
- DB migration: `ALTER TABLE "RoomScan" ADD COLUMN "modelUrl" TEXT`
- ANTHROPIC_API_KEY env var needed for AI estimates
- iOS build via Xcode for AR/LiDAR features

## Session 8 (2026-03-05) — 5 Features + Deploy + Production Fixes + Audit

**5 new features implemented:**

1. **Voice-to-Quote / Notes-to-Estimate** — COMPLETE
   - `src/app/api/quotes/voice-parse/route.ts` — Claude parses spoken/typed notes into rooms + materials
   - `src/components/voice-to-quote.tsx` — Toggle voice (Web Speech API) or type/paste mode
   - `src/types/speech.d.ts` — TypeScript declarations for Web Speech API
   - Big pulsing mic button, real-time transcript, AI processing, "Use This Estimate"
   - Integrated into quote wizard Step 2

2. **Competitor Quote Comparison** — COMPLETE
   - `src/app/api/quotes/compare/route.ts` — Claude Vision extracts line items from competitor quote photos
   - `src/components/quote-comparison.tsx` — photo capture, side-by-side pricing table, "Beat by X%" slider, counter-quote generation
   - Integrated into quote wizard Step 2 + quote detail page

3. **Timelapse Job Documentation** — COMPLETE
   - `src/components/timelapse-capture.tsx` — start/stop timelapse, configurable intervals (30min/1hr/2hr/manual), browser notifications
   - `src/components/timelapse-viewer.tsx` — playback with scrubber, speed controls, fullscreen, thumbnail strip
   - Integrated into jobs page (capture during in_progress, viewer on completed)

4. **Floor Plan Editor** — COMPLETE
   - `src/components/floorplan-editor.tsx` — drag-and-drop rooms on grid canvas, resize handles, double-click rename, configurable scale (ft/cell), total sqft calculation
   - "Use This Layout" feeds rooms into quote wizard Step 3
   - Integrated into quote wizard Step 2

5. **Notes-to-Estimate (text input)** — COMPLETE
   - Added type/paste tab to voice-to-quote component
   - Same AI parsing backend, just text input instead of speech
   - Falls back to type mode on browsers without Web Speech API

**Production bug fix — missing Docker packages:**
- `zod`, `stripe`, `resend`, `postal-mime`, `@anthropic-ai/sdk` were not traced by Next.js standalone build
- Added to Dockerfile COPY lines and `serverExternalPackages` in next.config.ts
- This was causing 500 errors on signup and any route using these packages

**Quick wins completed:**
- Cron jobs: crontab at 7 AM UTC daily for `/api/quotes/recur` and `/api/follow-ups/send`
- R2 bucket: `contractorcalc` created on Cloudflare (credentials still need API token)
- E2E test: signup 201, customer/quote/job/invoice/follow-up all create + read successfully

**Full production audit — all passing:**
- Public pages: login, signup, landing, privacy, terms — all 200
- Auth protection: all API routes return 401 unauthenticated
- New endpoints: voice-parse, compare — 401 unauthenticated (correct)
- Cron endpoints: 401 without auth, 200 with auth
- Public quote page: 200
- Dashboard pages: 307 redirect to login (correct)
- PWA assets: manifest, SW, favicon — all 200
- SSL: valid until Jun 3, 2026
- Server disk: 57/94 GB (64%)
- App startup: 202ms

**Files created (8):**
- `src/app/api/quotes/voice-parse/route.ts`
- `src/app/api/quotes/compare/route.ts`
- `src/components/voice-to-quote.tsx`
- `src/components/quote-comparison.tsx`
- `src/components/timelapse-capture.tsx`
- `src/components/timelapse-viewer.tsx`
- `src/components/floorplan-editor.tsx`
- `src/types/speech.d.ts`

**Files modified (5):**
- `src/app/(dashboard)/quotes/new/page.tsx` (integrated voice, comparison, floorplan)
- `src/app/(dashboard)/quotes/[id]/page.tsx` (added competitor comparison)
- `src/app/(dashboard)/jobs/page.tsx` (added timelapse capture + viewer)
- `Dockerfile` (added missing packages: zod, stripe, resend, postal-mime, @anthropic-ai)
- `next.config.ts` (added serverExternalPackages)

**API route count: 40 endpoints (was 38)**

---

## Session 9 (2026-03-06) — 8 Power Features: SMS, AI Multi-Photo, Receipts, Marketplace, Reviews, Calendar, Price Sync

**8 features implemented:**

1. **Smart Material Price Sync** — COMPLETE
   - `src/app/api/materials/prices/route.ts` — GET prices + 90-day trend data, POST manual price updates
   - `src/components/price-trend-badge.tsx` — inline trend badge (up/down/stable with percentage)
   - `prisma/schema.prisma` — PriceHistory model with materialType + recordedAt index

2. **Customer SMS Notifications** — COMPLETE
   - `src/lib/sms.ts` — Twilio wrapper with dev-mode console logging fallback
   - `src/app/api/sms/send/route.ts` — POST endpoint for quote_sent, job_reminder, custom SMS
   - `src/components/sms-button.tsx` — reusable SMS send button
   - Message formatters: quote link, quote accepted, job reminder
   - Integrated into quote detail (SMS Quote Link) and jobs page (SMS Reminder)

3. **Multi-Photo AI Estimate** — COMPLETE
   - Updated `src/app/api/quotes/ai-estimate/route.ts` — accepts `images[]` array (up to 10)
   - Updated `src/components/ai-estimate.tsx` — multi-photo grid, add/remove photos, bulk analysis
   - Backwards-compatible: still accepts single `image` field

4. **Expense Receipt Scanning** — COMPLETE
   - `src/app/api/receipts/scan/route.ts` — Claude Vision extracts line items from receipt photos
   - `src/components/receipt-scanner.tsx` — photo capture, parsed items display, "Add to Job Costs"
   - Uses existing POST /api/jobs/[id] with type="cost" to save ActualCost records
   - Integrated into jobs page (available during in_progress + completed)

5. **Google Calendar Sync** — COMPLETE
   - `src/app/api/calendar/sync/route.ts` — generates Google Calendar event URL with job details
   - `src/components/calendar-sync.tsx` — "Add to Google Calendar" button, opens in new tab
   - Pre-fills: title (trade + customer), description (quote/phone/notes), location (address), dates
   - Integrated into jobs page detail panel

6. **Template Marketplace** — COMPLETE
   - `prisma/schema.prisma` — SharedTemplate model with trade + downloads indexes
   - `src/app/api/templates/marketplace/route.ts` — GET browse (filter by trade, sort), POST share, PATCH clone
   - `src/components/marketplace-browser.tsx` — browse/filter/sort shared templates, one-click clone
   - `src/components/share-to-marketplace.tsx` — share your template with optional description
   - Integrated into templates page + template action buttons

7. **Client Review Widget** — COMPLETE
   - `prisma/schema.prisma` — Review model with contractor/customer/quote relations, unique token
   - `src/app/api/reviews/route.ts` — GET list reviews, POST create review request (sends email)
   - `src/app/api/reviews/[token]/route.ts` — GET/POST public review (star rating + comment)
   - `src/app/review/[token]/page.tsx` — public review page with star picker + comment form
   - `src/components/review-request.tsx` — "Request Review" button on accepted quotes
   - `src/lib/email.ts` — added sendReviewRequestEmail with CTA button
   - Integrated into quote detail (shows on accepted quotes)

8. **SMS + Review Quick Actions on Quotes** — COMPLETE
   - Added Quick Actions card to quote detail page
   - SMS Quote Link button (visible when quote is sent + customer has phone)
   - Review Request button (visible when quote is accepted + customer has email)

**Schema changes (3 new models, 20 tables total):**
- PriceHistory — material price tracking over time
- Review — customer review/testimonial with public token
- SharedTemplate — marketplace templates shared between contractors
- Added `reviews Review[]` relation to Contractor and Customer models

**Files created (15):**
- `src/lib/sms.ts`
- `src/app/api/materials/prices/route.ts`
- `src/app/api/sms/send/route.ts`
- `src/app/api/receipts/scan/route.ts`
- `src/app/api/reviews/route.ts`
- `src/app/api/reviews/[token]/route.ts`
- `src/app/api/templates/marketplace/route.ts`
- `src/app/api/calendar/sync/route.ts`
- `src/components/price-trend-badge.tsx`
- `src/components/sms-button.tsx`
- `src/components/receipt-scanner.tsx`
- `src/components/calendar-sync.tsx`
- `src/components/review-request.tsx`
- `src/components/marketplace-browser.tsx`
- `src/components/share-to-marketplace.tsx`
- `src/app/review/[token]/page.tsx`

**Files modified (9):**
- `prisma/schema.prisma` (3 new models + 2 relation fields)
- `src/app/api/quotes/ai-estimate/route.ts` (multi-photo support)
- `src/components/ai-estimate.tsx` (multi-photo UI)
- `src/lib/email.ts` (review request email)
- `src/app/(dashboard)/quotes/[id]/page.tsx` (SMS + Review actions)
- `src/app/(dashboard)/jobs/page.tsx` (Calendar Sync, Receipt Scanner, SMS Reminder)
- `src/app/(dashboard)/templates/page.tsx` (Marketplace browser)
- `src/app/(dashboard)/templates/actions.tsx` (Share to Marketplace button)
- `Dockerfile` (twilio package)
- `next.config.ts` (twilio in serverExternalPackages)

**New dependencies:** twilio
**API route count: 47 endpoints (was 40)**
**DB table count: 20 (was 17)**

---

## Deployment Instructions

### DB Migrations (run on server)
```sql
CREATE TABLE "PriceHistory" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "materialType" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "source" TEXT NOT NULL,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PriceHistory_materialType_recordedAt_idx" ON "PriceHistory"("materialType", "recordedAt");

CREATE TABLE "Review" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "contractorId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "quoteId" TEXT NOT NULL,
  "token" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "rating" INTEGER,
  "comment" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "submittedAt" TIMESTAMP(3),
  CONSTRAINT "Review_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Review_token_key" UNIQUE ("token"),
  CONSTRAINT "Review_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE CASCADE,
  CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id"),
  CONSTRAINT "Review_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE
);
CREATE INDEX "Review_contractorId_idx" ON "Review"("contractorId");
CREATE INDEX "Review_token_idx" ON "Review"("token");

CREATE TABLE "SharedTemplate" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "authorName" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "trade" TEXT NOT NULL,
  "materials" JSONB NOT NULL,
  "markupPercent" DOUBLE PRECISION NOT NULL DEFAULT 50,
  "laborCost" DOUBLE PRECISION,
  "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "description" TEXT,
  "downloads" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SharedTemplate_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SharedTemplate_trade_idx" ON "SharedTemplate"("trade");
CREATE INDEX "SharedTemplate_downloads_idx" ON "SharedTemplate"("downloads");
```

### Env Vars (add to server .env)
```
TWILIO_ACCOUNT_SID=<your Twilio Account SID>
TWILIO_AUTH_TOKEN=<your Twilio Auth Token>
TWILIO_PHONE_NUMBER=<your Twilio phone number>
```

### Deploy Steps
1. SSH to server, apply SQL migrations
2. Add Twilio env vars to `~/server/contractorcalc/.env` (future — SMS logs to console without)
3. Deploy code: tar into `~/server/contractorcalc/src/` (NOT parent dir!) + docker compose build + up
4. Verify: `curl https://contract.portofcams.com/api/reviews -I` should return 401

### Deployment — COMPLETED
- SQL migrations: 3 tables created (PriceHistory, Review, SharedTemplate)
- Docker build: succeeded after discovering server structure issue
- App restarted and verified: `/api/reviews` → 401, `/review/test` → 200

**IMPORTANT — Server directory structure:**
- `~/server/contractorcalc/` — outer project dir (docker-compose.yml, .env)
- `~/server/contractorcalc/src/` — Docker build context (Dockerfile, package.json, tsconfig.json)
- `~/server/contractorcalc/src/src/` — actual Next.js source code (app/, components/, lib/)
- Deploy tarballs must be extracted into `src/` not the parent dir!

**Correct deploy command:**
```bash
tar czf /tmp/cc-deploy.tar.gz --exclude=node_modules --exclude=.next --exclude=.git --exclude=ios .
scp /tmp/cc-deploy.tar.gz root@144.202.116.229:/tmp/
ssh root@144.202.116.229 "cd ~/server/contractorcalc/src && tar xzf /tmp/cc-deploy.tar.gz && rm /tmp/cc-deploy.tar.gz && cd .. && docker compose build && docker compose up -d"
```

---

## Tomorrow's Plan

### Manual Steps (need your action)
1. **Deploy Session 9** — SSH to server, run SQL migrations above, deploy code
2. **Twilio setup (future upgrade)** — SMS features work without Twilio (logs to console). When ready: create Twilio account, buy number, add env vars
3. **R2 API token** — Cloudflare dashboard > R2 > Manage R2 API Tokens (still pending from Session 8)
4. **Stripe webhook** — Still pending from Session 8
5. **iOS build** — Still pending from Session 8

### Feature Ideas for Next Session
1. **Weekly P&L email** — automated profit/loss summary emailed to contractor every Monday
2. **Subcontractor portal** — CrewMembers get their own login to view assigned jobs + log hours
3. **Bulk quote send** — select multiple quotes and send them all at once
4. **Review dashboard widget** — show average rating + recent reviews on main dashboard
5. **Price alert notifications** — email contractor when material prices change significantly
6. **Quote PDF redesign** — professional branded template with before/after photos
7. **Mobile push notifications** — Capacitor local notifications for new quote views/accepts
8. **Customer portal** — let customers view all their quotes/invoices in one place
9. **Automated job scheduling** — suggest optimal dates based on existing calendar
10. **Profit margin calculator** — real-time P&L per job with actual vs estimated costs

## Incident — 2026-03-08: Server Disk Full + CPU Overload

### What happened
- Server disk hit **100% (90GB/94GB)** — caused dockerd to thrash (42% CPU, 1.1GB RAM) due to failed I/O retries
- A Claude session running ContractorCalc was doing `docker compose build` which triggered a Next.js build inside Docker
- The `next build` process consumed **120-170% CPU** on a 2-vCPU server, starving all other services
- `docker system prune -af` was run (by the other session) which removed all cached images, forcing a full rebuild from scratch — making the build even longer
- The build kept restarting after being killed because the Claude session was retrying automatically

### Resolution
1. Freed disk space (cleaned Docker images/build cache/containerd snapshots)
2. Killed the runaway `next build` processes manually
3. Stopped the Claude session that kept retrying the build
4. Added **CPU/memory limits** to all Docker Compose files:
   - contractorcalc-app: 0.30 CPU / 256M
   - contractorcalc-db: 0.20 CPU / 256M
   - (All other services similarly capped)
5. Set **systemd priority** for MediaMTX (Nice=-5, CPUWeight=200) over Docker (Nice=10, CPUWeight=50)
6. Disabled native Caddy (NPM handles ports 80/443)

### Key takeaway
- **Never run `docker compose build` for Next.js apps on this server without CPU limits** — the build will consume all available CPU
- Consider building images locally or in CI and pushing to a registry instead
- The resource limits in docker-compose.yml will prevent this from happening again at runtime, but build-time limits need `--cpus` flag on `docker build`

---

## Session 10 (2026-03-09) — 5 Features: Reviews Widget, Profit Calculator, Weekly P&L, Bulk Send, Customer Portal

**5 features implemented:**

1. **Review Dashboard Widget** — COMPLETE
   - Added to `src/app/(dashboard)/dashboard/page.tsx`
   - Shows average star rating (filled/empty star SVGs), total review count
   - Last 3 submitted reviews with customer name, date, stars, comment snippet
   - Empty state with friendly message when no reviews

2. **Profit Margin Calculator** — COMPLETE
   - `src/app/api/jobs/[id]/profit/route.ts` — GET returns estimated vs actual cost analysis
   - `src/components/profit-calculator.tsx` — collapsible panel with revenue/cost bars, est vs actual table, expense line items
   - Integrated into jobs page detail panel (in_progress + completed jobs)

3. **Weekly P&L Email** — COMPLETE
   - `src/app/api/reports/weekly-pnl/route.ts` — cron endpoint, iterates all contractors, sends weekly summary
   - `sendWeeklyPnLEmail` added to `src/lib/email.ts` — dark theme HTML email with revenue/costs/profit grid, jobs/quotes stats, top deals
   - Optional `CRON_SECRET` auth via x-api-key header

4. **Bulk Quote Send** — COMPLETE
   - `src/app/api/quotes/bulk-send/route.ts` — POST with quoteIds[], generates PDF + emails for each, creates auto follow-ups
   - `src/app/(dashboard)/quotes/QuotesList.tsx` — client component with checkbox selection, "Select All Drafts", floating action bar
   - `src/app/(dashboard)/quotes/page.tsx` — refactored to pass serialized data to client component

5. **Customer Portal** — COMPLETE
   - `portalToken` field added to Customer model in `prisma/schema.prisma`
   - `src/app/api/portal/[token]/route.ts` — public GET returns customer's quotes/invoices/jobs
   - `src/app/portal/[token]/page.tsx` — public page with quotes (links to public quote), invoices (pay buttons), jobs, contractor contact
   - `src/components/copy-portal-link.tsx` — clipboard copy button
   - Integrated into customer detail page header

**Schema changes (1 new field):**
- Customer: added `portalToken` (String, unique, default uuid)

**Migration SQL:**
```sql
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "portalToken" TEXT UNIQUE DEFAULT gen_random_uuid();
UPDATE "Customer" SET "portalToken" = gen_random_uuid() WHERE "portalToken" IS NULL;
```

**Files created (7):**
- `src/app/api/jobs/[id]/profit/route.ts`
- `src/app/api/quotes/bulk-send/route.ts`
- `src/app/api/portal/[token]/route.ts`
- `src/app/api/reports/weekly-pnl/route.ts`
- `src/app/portal/[token]/page.tsx`
- `src/components/profit-calculator.tsx`
- `src/components/copy-portal-link.tsx`

**Files modified (7):**
- `src/app/(dashboard)/dashboard/page.tsx` (review widget)
- `src/app/(dashboard)/jobs/page.tsx` (profit calculator)
- `src/app/(dashboard)/quotes/page.tsx` (refactored for bulk send)
- `src/app/(dashboard)/quotes/QuotesList.tsx` (new client component)
- `src/app/(dashboard)/customers/[id]/page.tsx` (portal link)
- `src/lib/email.ts` (weekly P&L email function)
- `prisma/schema.prisma` (portalToken on Customer)

**API route count: 51 endpoints (was 47)**
**DB table count: 20 (unchanged, 1 new column)**

---

## Deployment Instructions

### Env Vars for cron (optional)
```
CRON_SECRET=<any secret string for weekly P&L cron auth>
```

### Cron Job
Add weekly P&L to crontab (Monday 7 AM UTC):
```
0 7 * * 1 curl -s -H "x-api-key: $CRON_SECRET" https://contract.portofcams.com/api/reports/weekly-pnl
```

### Deployment — COMPLETED (2026-03-09)
- Fixed `DATABASE_URL` in server `.env` — was pointing to `localhost:5432` (dev), changed to `db:5432` (Docker network)
- Wiped stale build context at `~/server/contractorcalc/src/` and re-extracted fresh tarball
- Previous deploys had stale file state causing Next.js route discovery to miss new files
- Docker build succeeded, all 5 new routes compiled: profit, bulk-send, portal (API + page), weekly-pnl
- Verified: portal API returns customer data (200), profit route returns 401 (auth required), bulk-send returns 405 (POST only)
- Server disk: 29GB free (68% used)

---

### Prompt to Resume
```
Continue working on ContractorCalc (~/contractor-tool). Read the session log at
~/contractor-tool/SESSION_LOG.md for full context (Session 10 is the latest).

The app is deployed and healthy at contract.portofcams.com. 51 API routes, 20 DB tables.
Server: 144.202.116.229 (SSH root, key-based). Docker: contractorcalc-app + contractorcalc-db.

Pick features from the "Tomorrow's Plan" list, or work on whatever I ask.
```
