# ContractorCalc

## Overview
B2B SaaS for flooring/renovation contractors. Calculate materials, generate quotes, manage projects, track jobs and invoices. Built for field use — mobile-first with offline support and auto-save.

**Live**: `https://contract.portofcams.com`
**Login**: `portofcams@gmail.com` / `Cameraman1$` (credentials auth, Google OAuth removed)

## Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API routes (47 endpoints), NextAuth.js (credentials provider)
- **Database**: PostgreSQL 17 via Prisma 6 ORM (20+ models)
- **iOS**: Capacitor 8 (LiDAR scanning, camera, offline storage)
- **AI**: Anthropic Claude (photo estimates, voice parsing, receipt scanning, competitor quote extraction)
- **Services**: Stripe (payments), Resend (email), Twilio (SMS), Cloudflare R2 (file storage)

## Server
- **IP**: 144.202.116.229
- **Docker**: `contractorcalc-app` (port 8002) + `contractorcalc-db` (PostgreSQL)
- **Domain**: `contract.portofcams.com` via Nginx Proxy Manager + Let's Encrypt
- **DB Creds**: `contractorcalc` / `cc_prod_2024` / database `contractor_tool`

## Deploy
```bash
# From ~/contractor-tool locally:
tar czf /tmp/cc-deploy.tar.gz --exclude=node_modules --exclude=.next --exclude=.git --exclude=db-data --exclude=e2e --exclude=.env .
scp /tmp/cc-deploy.tar.gz root@144.202.116.229:/tmp/
ssh root@144.202.116.229 "cd ~/server/contractorcalc/src && tar xzf /tmp/cc-deploy.tar.gz && cd .. && docker compose build app && docker compose up -d --force-recreate app"
```
**CRITICAL**: Docker build context is `~/server/contractorcalc/src/` (extract tarball INTO `src/`). Prisma 7 is NOT compatible — `npx prisma migrate deploy` will fail. Apply migrations via raw SQL into the DB container instead:
```bash
ssh root@144.202.116.229 'docker exec contractorcalc-db psql -U contractorcalc -d contractor_tool -c "SQL HERE"'
```

## Key Features

### Price Book (`/price-book`)
- Pre-loaded catalog of line items with saved pricing
- Material items: 8% waste factor auto-applied to sqft quantities
- Labor items: raw sqft, no waste
- Per-each items (dumpster, transitions): manual qty
- Seed defaults: 16 flooring items (materials + labor + misc)

### Estimate Builder (`/estimates/new`) — Core Feature
- **Single-page** estimate builder (NOT the 4-step wizard)
- Enter customer, project name, address, sqft
- Pick line items from price book — sqft auto-populates
- Materials: qty = sqft × 1.08 (8% waste), Labor: qty = sqft × 1.00
- Project notes for scope/conditions
- **Auto-save**: localStorage on every change + server draft every 30s
- **Offline support**: saves locally if no connection, syncs when back online
- **Draft recovery**: restores in-progress estimate on page reload (24hr window)
- **Navigate-away warning**: beforeunload prevents accidental loss
- Saves as standard Quote — PDF/email/portal/job conversion all work

### Quote Wizard (`/quotes/new`) — Original 4-Step Flow
- Customer → Trade → Dimensions → Review
- AI photo estimate (Claude Vision, up to 10 photos)
- Voice-to-estimate (speech parsing)
- Competitor quote comparison
- LiDAR room scanning (iOS)
- Floor plan editor

### Project Management (`/projects`)
- Projects with phases, tasks, daily logs, change orders
- Subcontractor management and bidding
- Document storage
- Budget tracking (estimated vs actual)

### Jobs & Invoices
- Quote → Job conversion on acceptance
- Job scheduling with crew assignments
- Actual cost tracking + receipt scanning (Claude Vision OCR)
- Profit/loss analysis (estimated vs actual)
- Stripe payment links on invoices

## Database Schema (Key Models)
- `Contractor` — user account, defaults (markup, tax, labor)
- `Customer` — name, email, phone, address, portal token
- `Quote` — materials (JSON), pricing, status, projectName, address, sqft, notes
- `MaterialCost` — price book items (name, category, itemType, unit, costPerUnit, wasteFactor, active)
- `QuoteTemplate` — reusable quote configs
- `Project` — phases, tasks, daily logs, change orders, documents
- `Job` — scheduled work from accepted quotes
- `Invoice` — billing with Stripe integration
- `ActualCost` — real expenses per job
- `SiteNote`, `SitePhoto`, `VoiceNote` — field documentation

## API Routes (47 total)
| Area | Endpoints |
|------|-----------|
| Quotes | `/api/quotes` (CRUD), `/api/quotes/[id]/send`, `/api/quotes/[id]/pdf`, `/api/quotes/ai-estimate`, `/api/quotes/voice-parse`, `/api/quotes/compare` |
| Price Book | `/api/price-book` (CRUD), `/api/price-book/[id]`, `/api/price-book/seed` |
| Templates | `/api/templates` (CRUD), `/api/templates/marketplace` |
| Materials | `/api/materials/prices` (GET/POST) |
| Projects | `/api/projects` (CRUD), phases, tasks, daily-logs, change-orders, documents |
| Jobs | `/api/jobs` (CRUD), `/api/jobs/[id]/profit` |
| Invoices | `/api/invoices` (CRUD), `/api/invoices/[id]/checkout` |
| Other | `/api/customers`, `/api/site-notes`, `/api/receipts/scan`, `/api/usage` |

## Key Files
| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Full data model (20+ tables) |
| `src/lib/auth.ts` | NextAuth config (credentials only) |
| `src/lib/calculators.ts` | Trade calculators + default material costs |
| `src/app/(dashboard)/estimates/new/page.tsx` | Estimate builder with auto-save |
| `src/app/(dashboard)/price-book/page.tsx` | Price book management |
| `src/app/(dashboard)/quotes/new/page.tsx` | 4-step quote wizard |
| `src/app/(dashboard)/quotes/[id]/page.tsx` | Quote detail view |
| `src/app/(dashboard)/projects/[id]/page.tsx` | Project detail (8 tabs) |
| `src/components/layout/sidebar.tsx` | Dashboard navigation |

## Cron Jobs (Server)
- Daily 7 AM UTC: `/api/quotes/recur` (create recurring quotes)
- Daily 7 AM UTC: `/api/follow-ups/send` (auto follow-up emails)

## Conventions
- Auth: `getServerSession(authOptions)` in API routes, `getContractor()` in server components
- Validation: Zod schemas on all POST/PATCH endpoints
- UI: shadcn/ui components, dark/light theme
- Offline: IndexedDB sync queue with exponential backoff
- Rate limiting: token-bucket on POST/PATCH/DELETE

## Session History
See `SESSION_LOG.md` for full history (Sessions 1-9, plus current session 10).
