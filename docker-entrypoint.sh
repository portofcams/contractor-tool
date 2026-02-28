#!/bin/sh
set -e

# Run Prisma migrations before starting the app
echo "Running database migrations..."
npx prisma migrate deploy

# Seed if needed (first deploy only — idempotent)
echo "Seeding database..."
npx tsx prisma/seed.ts 2>/dev/null || true

echo "Starting ContractorCalc..."
exec node server.js
