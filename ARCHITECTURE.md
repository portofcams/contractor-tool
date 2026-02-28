# ContractorCalc — Architecture Overview

## What This Is
B2B SaaS tool that helps flooring, painting, and drywall contractors calculate materials from floor plans in 30 seconds and generate professional quotes.

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
│  │  Tailwind   │    │  + Filesystem     │    │                │  │
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
│  └───────────┘    │  API Routes:       │    │  Tables:       │  │
│                   │  /api/auth/*       │    │  Contractor    │  │
│                   │  /api/customers    │    │  Customer      │  │
│                   │  /api/quotes       │    │  FloorPlan     │  │
│                   │                    │    │  Quote         │  │
│                   │  Server Pages:     │    │  MaterialCost  │  │
│                   │  Dashboard, CRUD   │    │                │  │
│                   └────────────────────┘    └────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                     EXTERNAL SERVICES                            │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │  Stripe  │  │  Resend  │  │  R2/S3   │  │  GitHub        │  │
│  │  Billing │  │  Email   │  │  Uploads │  │  CI/CD         │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer        | Technology                | Why                                    |
|-------------|---------------------------|----------------------------------------|
| Frontend    | Next.js 16, React 19      | SSR + API routes in one codebase       |
| UI          | Tailwind CSS v4, shadcn   | Fast, mobile-first component library   |
| iOS App     | Capacitor 8               | Native shell wrapping the web app      |
| Auth        | NextAuth.js 4             | Email/password, JWT sessions           |
| Database    | PostgreSQL 17, Prisma 6   | Relational data, type-safe ORM         |
| Payments    | Stripe                    | Subscriptions, free/pro/business tiers |
| Email       | Resend                    | Transactional emails, quote delivery   |
| PDF         | @react-pdf/renderer       | Professional quote PDFs                |
| Uploads     | Cloudflare R2 or S3       | Floor plan storage                     |
| Hosting     | Vultr VPS + Nginx         | Full control, ~$6/mo                   |
| CI/CD       | GitHub Actions            | Auto-deploy on push to main            |
| Offline     | Capacitor Preferences     | Local-first data for iOS app           |

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
├── prisma/
│   ├── schema.prisma        # Database models
│   ├── migrations/          # Version-controlled schema changes
│   └── seed.ts              # Default material cost data
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login & signup (public)
│   │   ├── (dashboard)/     # All authenticated pages
│   │   │   ├── page.tsx     #   Dashboard with stats
│   │   │   ├── customers/   #   Customer CRUD
│   │   │   └── quotes/      #   Quote creator + history
│   │   └── api/             # Backend API routes
│   │       ├── auth/        #   NextAuth + signup
│   │       ├── customers/   #   Customer CRUD API
│   │       └── quotes/      #   Quote CRUD API + free tier limit
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Sidebar, mobile nav
│   │   ├── providers.tsx    # Session provider
│   │   └── capacitor-provider.tsx  # Native plugin init
│   ├── lib/
│   │   ├── auth.ts          # NextAuth config
│   │   ├── db.ts            # Prisma client singleton
│   │   ├── session.ts       # Server-side auth helpers
│   │   ├── calculators.ts   # Flooring/paint/drywall math
│   │   ├── offline-storage.ts  # Local data persistence
│   │   ├── sync-service.ts  # Offline ↔ server sync
│   │   └── capacitor-init.ts   # Native plugin bootstrap
│   └── types/
│       └── next-auth.d.ts   # Session type extensions
├── capacitor.config.ts      # iOS app configuration
├── next.config.ts           # Next.js configuration
└── package.json             # Scripts, dependencies
```

## Data Flow

### Quote Creation (5-step wizard)
```
Select Customer → Enter Room Dimensions → Choose Trade + Material
       ↓                    ↓                        ↓
  From DB or          Length × Width          Flooring: material + pattern
  create new          per room                Painting: type + coats
                                              Drywall: sheet size
                              ↓
                     Calculate Materials
                     (waste factors applied)
                              ↓
                   Review: markup + labor + tax
                              ↓
                      Save quote to DB
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
