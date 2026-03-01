# ContractorCalc — Architecture Overview

## What This Is
B2B SaaS tool that helps flooring, painting, and drywall contractors calculate materials from floor plans in 30 seconds, generate professional quotes, manage jobs, track invoices, and coordinate crews.

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                                                                  │
│  ┌─────────────┐    ┌──────────────────┐    ┌────────────────┐  │
│  │  Web App    │    │  iOS App          │    │  Mobile Web    │  │
│  │  (Browser)  │    │  (Capacitor)      │    │  (Responsive)  │  │
│  │             │    │                   │    │                │  │
│  │  Next.js    │    │  Native Shell     │    │  Same as web   │  │
│  │  React 19   │    │  + Camera plugin  │    │  + PWA-like    │  │
│  │  Tailwind   │    │  + LiDAR scanner  │    │                │  │
│  │  shadcn/ui  │    │  + Offline store  │    │                │  │
│  └──────┬──────┘    └────────┬─────────┘    └───────┬────────┘  │
│         │                    │                      │            │
│         └────────────────────┼──────────────────────┘            │
│                              │                                   │
│                     HTTPS API calls                              │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                        SERVER LAYER (Vultr VPS)                  │
│                              │                                   │
│  ┌───────────┐    ┌─────────┴─────────┐    ┌────────────────┐  │
│  │  Nginx    │───▶│  Next.js Server    │───▶│  PostgreSQL    │  │
│  │  (proxy)  │    │  (Node.js / PM2)   │    │  (Prisma ORM)  │  │
│  │  + SSL    │    │                    │    │                │  │
│  └───────────┘    │  API Routes:       │    │  16 models     │  │
│                   │  /api/auth/*       │    │  23 indexes    │  │
│                   │  /api/customers    │    │                │  │
│                   │  /api/quotes       │    │  See "Database │  │
│                   │  /api/jobs         │    │   Schema"      │  │
│                   │  /api/invoices     │    │   below        │  │
│                   │  /api/crew         │    │                │  │
│                   │  /api/stripe/*     │    │                │  │
│                   │  + 15 more         │    │                │  │
│                   │                    │    │                │  │
│                   │  Server Pages:     │    │                │  │
│                   │  Dashboard, CRUD,  │    │                │  │
│                   │  Calendar, Team    │    │                │  │
│                   └────────────────────┘    └────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                     EXTERNAL SERVICES                            │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │  Stripe  │  │  Resend  │  │  OpenSt. │  │  GitHub        │  │
│  │  Billing │  │  Email   │  │  Geocode │  │  CI/CD         │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer        | Technology                | Why                                    |
|-------------|---------------------------|----------------------------------------|
| Frontend    | Next.js 16, React 19      | SSR + API routes in one codebase       |
| UI          | Tailwind CSS v4, shadcn   | Fast, mobile-first component library   |
| Charts      | Recharts                  | Dashboard analytics visualizations     |
| iOS App     | Capacitor 8               | Native shell wrapping the web app      |
| Auth        | NextAuth.js 4             | Email/password, JWT sessions           |
| Database    | PostgreSQL 17, Prisma 6   | Relational data, type-safe ORM         |
| Payments    | Stripe                    | Subscriptions, free/pro/business tiers |
| Email       | Resend                    | Transactional emails, quote delivery   |
| PDF         | @react-pdf/renderer       | Professional quote PDFs                |
| Testing     | Vitest                    | Unit tests for calculators, utils      |
| Hosting     | Vultr VPS + Nginx         | Full control, ~$6/mo                   |
| CI/CD       | GitHub Actions            | Auto-deploy on push to main            |
| Offline     | Capacitor Preferences     | Local-first data for iOS app           |
| Geocoding   | OpenStreetMap Nominatim   | GPS auto-fill for customer addresses   |

## Directory Structure

```
contractor-tool/
├── .github/workflows/       # CI/CD pipelines
│   ├── deploy.yml           #   Push to main → deploy to Vultr
│   └── ios-build.yml        #   Verify iOS build compiles
├── deploy/                  # Server deployment scripts
│   ├── vultr-setup.sh       #   One-time VPS provisioning
│   └── env.production.example  # Production .env template
├── ios/                     # Capacitor iOS project (Xcode)
│   └── App/App/
│       └── RoomScannerPlugin.swift  # LiDAR room scanner
├── prisma/
│   ├── schema.prisma        # 16 database models
│   ├── migrations/          # Version-controlled schema changes
│   └── seed.ts              # Default material cost data
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login & signup (public)
│   │   ├── (dashboard)/     # All authenticated pages
│   │   │   ├── dashboard/   #   Stats, charts, top customers, CSV export
│   │   │   ├── customers/   #   Customer CRUD + site photos/notes
│   │   │   ├── quotes/      #   Quote wizard, history, quick estimate
│   │   │   ├── jobs/        #   Job calendar, status tracking
│   │   │   ├── invoices/    #   Invoice management, payments
│   │   │   ├── team/        #   Crew member CRUD
│   │   │   ├── templates/   #   Quote templates, load defaults
│   │   │   └── settings/    #   Profile, billing, notifications, logo, delete
│   │   ├── (marketing)/     # Landing page (testimonials, pricing)
│   │   ├── quote/[token]/   # Public customer portal (accept/decline/sign)
│   │   └── api/             # Backend API routes
│   │       ├── auth/        #   NextAuth + signup (rate limited)
│   │       ├── customers/   #   Customer CRUD
│   │       ├── quotes/      #   Quote CRUD + PDF + send + export
│   │       ├── jobs/        #   Job CRUD + status
│   │       ├── invoices/    #   Invoice CRUD + payments
│   │       ├── crew/        #   Crew member CRUD
│   │       ├── follow-ups/  #   Follow-up reminders
│   │       ├── voice-notes/ #   Audio upload (magic-byte verified)
│   │       ├── room-scans/  #   LiDAR scan data
│   │       ├── site-photos/ #   Photo upload (before/after types)
│   │       ├── site-notes/  #   Text notes
│   │       ├── floorplans/  #   Floor plan upload (drag & drop)
│   │       ├── templates/   #   Quote templates + defaults
│   │       ├── stripe/      #   Checkout, portal, webhooks
│   │       ├── settings/    #   Profile, logo, account, notifications
│   │       └── usage/       #   Plan usage for free tier enforcement
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Sidebar, mobile nav
│   │   ├── floor-plan-upload.tsx
│   │   ├── follow-up-manager.tsx
│   │   ├── offline-banner.tsx
│   │   ├── profit-tracker.tsx
│   │   ├── pull-to-refresh.tsx
│   │   ├── site-notes.tsx
│   │   ├── site-photos.tsx
│   │   ├── usage-indicator.tsx
│   │   ├── voice-recorder.tsx
│   │   ├── capacitor-provider.tsx
│   │   └── providers.tsx
│   ├── lib/
│   │   ├── auth.ts          # NextAuth config
│   │   ├── db.ts            # Prisma client singleton
│   │   ├── session.ts       # Server-side auth helpers
│   │   ├── calculators.ts   # Flooring/paint/drywall math
│   │   ├── stripe.ts        # Stripe SDK + plan definitions
│   │   ├── email.ts         # Resend email service
│   │   ├── rate-limit.ts    # Token-bucket rate limiter
│   │   ├── room-scanner.ts  # Capacitor LiDAR bridge
│   │   ├── offline-storage.ts  # Local data persistence
│   │   ├── sync-service.ts  # Offline ↔ server sync
│   │   ├── capacitor-init.ts   # Native plugin bootstrap
│   │   ├── pdf/
│   │   │   ├── quote-template.tsx  # PDF layout (logo, mobile-friendly)
│   │   │   └── render.ts          # Server-side PDF render
│   │   ├── calculators.test.ts    # Unit tests (flooring, paint, drywall)
│   │   ├── rate-limit.test.ts     # Rate limiter tests
│   │   └── csv-export.test.ts     # CSV export tests
│   └── types/
│       └── next-auth.d.ts   # Session type extensions
├── capacitor.config.ts      # iOS app configuration
├── next.config.ts           # Next.js configuration
└── package.json             # Scripts, dependencies
```

## Database Schema (16 models)

```
Contractor ──┬── Customer ──┬── Quote ──┬── Job ──┬── JobAssignment
             │              │           │         └── ActualCost
             │              │           ├── Invoice
             │              │           ├── FollowUp
             │              │           ├── RoomScan
             │              │           ├── SitePhoto (before/after)
             │              │           ├── SiteNote
             │              │           └── VoiceNote
             │              └── FloorPlan
             ├── MaterialCost
             ├── QuoteTemplate
             └── CrewMember ── JobAssignment
```

**Key fields**: `Contractor.logoUrl`, `Contractor.subscriptionPlan`, `Quote.pdfUrl`, `Quote.publicToken`, `Quote.signatureData`, `SitePhoto.photoType`, `Job.status`, `Invoice.paidAmount`

**Indexes**: 23 `@@index` declarations on foreign keys and frequently filtered columns.

## Data Flow

### Quote Creation (4-step wizard)
```
Select Customer → Enter Room Dimensions → Choose Trade + Material → Review & Create
       ↓                    ↓                        ↓                     ↓
  From DB or          Length × Width          Flooring/Painting/       Markup + labor
  create inline       per room (or LiDAR)    Drywall (multi-trade)    + tax applied
                                                                            ↓
                                                              Save + optionally email
                                                              (checks free tier limit)
```

### iOS Offline Flow
```
User creates quote offline
        ↓
Saved to Capacitor Preferences (local JSON)
Added to sync queue
        ↓
Network reconnects (auto-detected)
        ↓
Sync service pushes queue to server API
Marks local items as synced
Pulls latest server data
```

### Security
```
All POST/PATCH/DELETE routes:
  → Auth check (NextAuth session)
  → Rate limiting (token bucket)
  → IDOR validation (verify resource ownership)
  → Input validation (enum checks, length limits, magic bytes on uploads)
  → Prisma query (parameterized, no raw SQL)
```

## Business Rules

| Rule                  | Value                               |
|----------------------|-------------------------------------|
| Free tier            | 5 quotes/month                      |
| Pro tier             | $29/mo, unlimited quotes, 1 trade   |
| Business tier        | $49/mo, unlimited quotes, all trades|
| Free trial           | 14 days, no credit card             |
| Default markup       | 50% on materials                    |
| Flooring waste       | Straight 10%, Diagonal 15%, Herringbone 20% |
| Paint coverage       | Interior 350 sqft/gal, Exterior 300, Ceiling 400 |
| Drywall mud          | 1 bucket per 8 sheets               |
| Drywall tape         | 1 ft per 4 sqft                     |

## Deployment

### Live URL
`https://contractor.portofcams.com`

### GitHub → Vultr Pipeline
```
git push origin main
        ↓
GitHub Actions: lint → typecheck → build
        ↓
SSH into Vultr VPS
        ↓
git pull → npm ci → prisma migrate → build → pm2 restart
```

### iOS Deployment
```
npm run ios → opens Xcode
        ↓
Build & test on simulator
        ↓
Archive → Upload to App Store Connect
        ↓
TestFlight → App Store review → Release
```
