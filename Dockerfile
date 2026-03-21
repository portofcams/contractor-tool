FROM node:20-alpine AS base

# ── Dependencies ──
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Build ──
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

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
