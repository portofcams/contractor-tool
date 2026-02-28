#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Vultr VPS Initial Setup — ContractorCalc
# ─────────────────────────────────────────────────────────────
#
# Run this ONCE on a fresh Vultr Ubuntu 22.04+ VPS.
#
# What it does:
#   1. Updates the system
#   2. Installs Node.js 20, PostgreSQL 17, Nginx, PM2
#   3. Creates the deploy user and database
#   4. Clones the repo and sets up the app
#   5. Configures Nginx reverse proxy
#   6. Sets up SSL via Certbot
#
# Usage:
#   scp deploy/vultr-setup.sh root@YOUR_VULTR_IP:/tmp/
#   ssh root@YOUR_VULTR_IP 'bash /tmp/vultr-setup.sh'
#
# After running:
#   1. Set up GitHub Secrets (VULTR_HOST, VULTR_USER, VULTR_SSH_KEY)
#   2. Create .env on the server: /opt/contractorcalc/.env
#   3. Run first migration: cd /opt/contractorcalc && npx prisma migrate deploy
#   4. Point your domain DNS to the Vultr IP
#   5. Run: sudo certbot --nginx -d contractorcalc.com
# ─────────────────────────────────────────────────────────────

set -euo pipefail

DOMAIN="${1:-contractorcalc.com}"
DEPLOY_USER="deploy"
APP_DIR="/opt/contractorcalc"
DB_NAME="contractor_tool"
DB_USER="contractorcalc"
DB_PASS=$(openssl rand -hex 16)

echo "═══════════════════════════════════════"
echo "  ContractorCalc — Vultr VPS Setup"
echo "═══════════════════════════════════════"

# ── 1. System Updates ──
echo "→ Updating system..."
apt-get update && apt-get upgrade -y
apt-get install -y curl git build-essential ufw nginx certbot python3-certbot-nginx

# ── 2. Node.js 20 ──
echo "→ Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

# ── 3. PostgreSQL 17 ──
echo "→ Installing PostgreSQL..."
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
apt-get update
apt-get install -y postgresql-17

# ── 4. Create Database ──
echo "→ Setting up database..."
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

echo "
╔══════════════════════════════════════════════╗
  DATABASE CREDENTIALS (save these!)
  DB_NAME: ${DB_NAME}
  DB_USER: ${DB_USER}
  DB_PASS: ${DB_PASS}
  DATABASE_URL: postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}
╚══════════════════════════════════════════════╝
"

# ── 5. Deploy User ──
echo "→ Creating deploy user..."
useradd -m -s /bin/bash ${DEPLOY_USER} || true
mkdir -p /home/${DEPLOY_USER}/.ssh
cp /root/.ssh/authorized_keys /home/${DEPLOY_USER}/.ssh/ 2>/dev/null || true
chown -R ${DEPLOY_USER}:${DEPLOY_USER} /home/${DEPLOY_USER}/.ssh
chmod 700 /home/${DEPLOY_USER}/.ssh

# ── 6. Clone Repo ──
echo "→ Setting up app directory..."
mkdir -p ${APP_DIR}
chown ${DEPLOY_USER}:${DEPLOY_USER} ${APP_DIR}

echo "
NOTE: After setup, clone the repo manually:
  sudo -u ${DEPLOY_USER} git clone https://github.com/YOUR_USER/contractor-tool.git ${APP_DIR}
"

# ── 7. Nginx Config ──
echo "→ Configuring Nginx..."
cat > /etc/nginx/sites-available/contractorcalc << NGINX
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    # Redirect to HTTPS (certbot will add this)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # File upload limit (floor plans)
        client_max_body_size 50M;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/contractorcalc /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# ── 8. Firewall ──
echo "→ Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# ── 9. PM2 Startup ──
echo "→ Configuring PM2 startup..."
pm2 startup systemd -u ${DEPLOY_USER} --hp /home/${DEPLOY_USER}

echo "
═══════════════════════════════════════════════
  ✅ VPS setup complete!

  Next steps:
  1. Clone the repo into ${APP_DIR}
  2. Create ${APP_DIR}/.env with production values
  3. cd ${APP_DIR} && npm ci && npx prisma migrate deploy && npm run build
  4. pm2 start npm --name contractorcalc -- start
  5. Point DNS A record to this server IP
  6. Run: sudo certbot --nginx -d ${DOMAIN}
═══════════════════════════════════════════════
"
