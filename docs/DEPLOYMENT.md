# ContractorCalc — Deployment Guide

## Overview

```
Local Dev → GitHub (push) → GitHub Actions (CI) → Vultr VPS (production)
                                                        ↑
                                            iOS app connects here
```

## Local Development

```bash
# Start PostgreSQL (if not running)
brew services start postgresql@17

# Start dev server
cd /Users/johnthomas/contractor-tool
npm run dev
# → http://localhost:3000

# Database management
npm run db:migrate    # Create/apply migrations
npm run db:seed       # Load default material costs
npm run db:studio     # Visual DB browser (Prisma Studio)
```

## GitHub Setup

### 1. Create the repository

```bash
cd /Users/johnthomas/contractor-tool
git remote add origin https://github.com/YOUR_USER/contractor-tool.git
git push -u origin main
```

### 2. Add GitHub Secrets

Go to: Repository → Settings → Secrets and variables → Actions

| Secret              | Description                         | Example                    |
|--------------------|-------------------------------------|----------------------------|
| `VULTR_HOST`       | VPS IP address                      | `149.28.123.456`           |
| `VULTR_USER`       | SSH user                            | `deploy`                   |
| `VULTR_SSH_KEY`    | Private SSH key (full PEM content)  | `-----BEGIN OPENSSH...`    |
| `DATABASE_URL`     | Production DB connection string     | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_SECRET`  | Auth encryption key                 | `openssl rand -hex 32`     |
| `NEXTAUTH_URL`     | Production URL                      | `https://contractorcalc.com` |

### 3. CI/CD Pipelines

**deploy.yml** — Triggers on push to `main`:
1. Lint + type check
2. Build Next.js
3. SSH into Vultr → pull code → migrate DB → restart app

**ios-build.yml** — Triggers on push that changes `src/`, `ios/`, or `capacitor.config.ts`:
1. Build web assets
2. Sync Capacitor
3. Verify Xcode build compiles (no signing)

## Vultr VPS Setup

### 1. Provision a server

- Go to [vultr.com](https://vultr.com)
- Deploy new server:
  - **Type**: Cloud Compute (Regular)
  - **OS**: Ubuntu 24.04
  - **Plan**: $6/mo (1 vCPU, 1 GB RAM) — enough to start
  - **Location**: Closest to your contractors (e.g. US East)
- Add your SSH key

### 2. Run the setup script

```bash
# Copy setup script to server
scp deploy/vultr-setup.sh root@YOUR_VULTR_IP:/tmp/

# Run it (installs Node, PostgreSQL, Nginx, PM2)
ssh root@YOUR_VULTR_IP 'bash /tmp/vultr-setup.sh'

# Save the database credentials it outputs!
```

### 3. Deploy the app

```bash
# SSH in as deploy user
ssh deploy@YOUR_VULTR_IP

# Clone the repo
cd /opt
git clone https://github.com/YOUR_USER/contractor-tool.git contractorcalc
cd contractorcalc

# Create production .env (use deploy/env.production.example as template)
cp deploy/env.production.example .env
nano .env  # Fill in real values

# Install, migrate, build, start
npm ci
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run build
pm2 start npm --name contractorcalc -- start
pm2 save
```

### 4. SSL Certificate

```bash
# Point your domain's A record to the Vultr IP first, then:
sudo certbot --nginx -d contractorcalc.com -d www.contractorcalc.com
```

### 5. Verify

```bash
# Check app is running
pm2 status
curl https://contractorcalc.com

# Check logs
pm2 logs contractorcalc
```

## Manual Deployment (without CI)

```bash
ssh deploy@YOUR_VULTR_IP
cd /opt/contractorcalc
git pull origin main
npm ci
npx prisma migrate deploy
npm run build
pm2 restart contractorcalc
```

## Monitoring

```bash
# App status
pm2 status

# App logs (live)
pm2 logs contractorcalc

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Database
sudo -u postgres psql contractor_tool

# Disk space
df -h

# Memory
free -h
```

## Scaling Notes

| Traffic Level | What to Do                                    |
|--------------|-----------------------------------------------|
| 0-100 users  | $6/mo Vultr VPS is fine                       |
| 100-500      | Upgrade to $12/mo (2 vCPU, 2 GB RAM)         |
| 500-2000     | Add Redis for sessions, consider read replica |
| 2000+        | Move to managed DB, add CDN, consider k8s     |
