FROM node:20-alpine AS base

# ── Dependencies ──
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Cache mount + fetch retries: plain `npm ci` flakes with ECONNRESET on
# emulated (Rosetta) amd64 builds under sustained network load.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --cache /root/.npm --maxsockets 4 \
    --fetch-retries=8 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

# ── Build ──
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Sentry/GlitchTip DSN must be present at build time: Next inlines NEXT_PUBLIC_*
# into the bundle during `next build` (runtime env is too late). Public,
# non-secret; defaults empty so non-prod builds stay dormant. The real value is
# passed via docker-compose `build.args` on the server.
ARG NEXT_PUBLIC_SENTRY_DSN=""
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN

# Generate Prisma client
RUN npx prisma generate

# next build's own SWC-binary downloader has no meaningful retry and dies
# near the end of the fetch under Rosetta-emulated network load — and once
# it fails, Next falls back to WASM bindings, which Turbopack (if enabled)
# refuses to run on at all. Install the native binary explicitly via npm's
# own --fetch-retries first, matching the installed next version, so next
# build finds it already present and never attempts its own download.
RUN --mount=type=cache,target=/root/.npm \
    NEXT_VERSION=$(node -p "require('./node_modules/next/package.json').version") && \
    npm install --no-save --cache /root/.npm \
      --fetch-retries=6 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000 \
      "@next/swc-linux-x64-musl@$NEXT_VERSION" && \
    npm run build

# ── Migrator (used for one-off migration runs) ──
FROM base AS migrator
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
CMD ["npx", "prisma", "migrate", "deploy"]

# ── Production ──
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
RUN mkdir -p /app/public/uploads/pdfs && chown -R nextjs:nodejs /app/public/uploads
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema (for runtime client)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy server external packages not traced by standalone build
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/node_modules/zod ./node_modules/zod
COPY --from=builder /app/node_modules/stripe ./node_modules/stripe
COPY --from=builder /app/node_modules/resend ./node_modules/resend
COPY --from=builder /app/node_modules/postal-mime ./node_modules/postal-mime
COPY --from=builder /app/node_modules/@anthropic-ai ./node_modules/@anthropic-ai
COPY --from=builder /app/node_modules/twilio ./node_modules/twilio

USER nextjs

EXPOSE 3002

CMD ["node", "server.js"]
