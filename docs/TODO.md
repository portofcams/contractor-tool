# ContractorCalc — TODO List

Prioritized backlog. Check items off as completed. Each section maps to a development session.

---

## Next Session (Priority — Ship the MVP)

### PDF Generation
- [x] Create quote PDF template with `@react-pdf/renderer`
- [x] Include: company header, customer info, materials table, pricing breakdown, terms
- [x] "Download PDF" button on quote detail page
- [ ] "Generate & Save" action stores PDF URL on the quote record
- [ ] Mobile-friendly PDF layout (contractors show these to clients on-site)
- [ ] Company logo in PDF header (requires logo upload feature)

### Email Quotes
- [x] Set up Resend integration (`src/lib/email.ts`)
- [x] "Email Quote" button on quote detail page with email dialog
- [x] Email template: professional HTML with PDF attachment
- [x] Track `sentAt` timestamp on quote (auto-updates status to "sent")
- [ ] Quote view tracking (optional: pixel or link click tracking)

### Stripe Subscriptions
- [x] Create Stripe products: Free, Pro ($29/mo), Business ($49/mo)
- [x] Billing page (`/settings/billing`)
- [x] Checkout flow (Stripe Checkout Session)
- [x] Webhook handler for subscription events
- [x] Enforce free tier limit (5 quotes/mo) — UI usage indicator + blocking card
- [x] 14-day free trial (no credit card required)
- [x] Subscription status badge in dashboard (UsageIndicator component)

---

## Following Session (Polish & Deploy)

### Vultr Production Deployment
- [ ] Provision Vultr VPS ($6/mo plan)
- [ ] Run `deploy/vultr-setup.sh`
- [ ] Configure production `.env`
- [ ] Point domain DNS to Vultr IP
- [ ] Set up SSL with Certbot
- [ ] Add GitHub Secrets for CI/CD
- [ ] Verify auto-deploy pipeline works end-to-end
- [ ] Set up PM2 monitoring

### iOS App Store Submission
- [ ] Test on iOS Simulator
- [ ] Test on physical device
- [ ] Design app icon (1024x1024)
- [ ] Add launch screen / splash assets
- [ ] Configure Xcode signing with Apple Developer account
- [ ] Take App Store screenshots (6.7", 6.1", iPad)
- [ ] Write App Store listing (title, subtitle, description, keywords)
- [ ] Submit for review

### GitHub Repository
- [x] Create GitHub repo (https://github.com/portofcams/contractor-tool)
- [x] Push all code (100 files, 19k lines)
- [ ] Add `.env` to secrets (do when setting up Vultr deploy)
- [ ] Verify CI/CD pipelines run (needs Vultr secrets first)
- [ ] Set up branch protection on `main`

---

## Future Sessions (Enhancements)

### Floor Plan Upload & Processing
- [ ] Set up Cloudflare R2 (or S3) bucket for file storage
- [ ] File upload component with drag & drop
- [ ] Support PDF and image uploads
- [ ] Store file URL and metadata in FloorPlan table
- [ ] Image preview in quote creator
- [ ] Future: AI-powered dimension extraction from floor plans

### Offline Improvements
- [ ] Conflict resolution UI (show conflicts, let user choose)
- [ ] Background sync via Capacitor Background Task plugin
- [ ] Delta sync (only changed records since last sync)
- [ ] Offline indicator in the UI (banner when offline)
- [ ] Queue status indicator (show pending sync count)

### Dashboard Enhancements
- [ ] Charts: monthly quote volume, revenue over time
- [ ] Win/loss rate by trade type
- [ ] Average quote value trends
- [ ] Top customers by revenue
- [ ] Exportable reports (CSV)

### Quote Templates
- [ ] Save quote as template
- [ ] Apply template to new quotes (pre-fill materials + pricing)
- [ ] Default templates per trade type

### Customer Portal
- [ ] Public quote view page (no login required, unique URL)
- [ ] "Accept" / "Decline" buttons for customers
- [ ] Digital signature capture
- [ ] Automatic status update on accept/decline

### Landing Page
- [ ] Marketing page at `/` for non-authenticated users
- [ ] Pricing table
- [ ] Feature highlights
- [ ] Testimonials section
- [ ] CTA → signup

### Settings Page
- [ ] Company profile (name, logo, contact)
- [ ] Default markup percentage
- [ ] Custom material pricing
- [ ] Trade preferences
- [ ] Notification preferences
- [ ] Account deletion

### Mobile Polish
- [ ] Swipe gestures on lists (swipe to delete, edit)
- [ ] Pull-to-refresh on quote/customer lists
- [ ] Haptic feedback on key actions
- [ ] Camera integration: take photo of floor plan
- [ ] Share sheet: share quote PDF via iOS share

---

## Technical Debt

- [ ] Add unit tests for calculators (`calculators.test.ts`)
- [ ] Add API route tests (quotes, customers)
- [ ] Add E2E tests (Playwright)
- [ ] Error boundary components
- [ ] Loading skeletons for server components
- [ ] Rate limiting on API routes
- [ ] Input sanitization audit
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Performance audit (Core Web Vitals)
- [ ] Database indexes on frequently queried columns
