# Deploying goodwinsecuritybh.com

The site runs as **one Docker container**: a Next.js standalone server with a SQLite database in a mounted `data/` folder. nginx on the host proxies the domain to it. The setup is built to sit alongside other sites on the same server without changing them.

- The container listens only on `127.0.0.1:3010` (set by `GOODWIN_PORT`), so it doesn't collide with an app already on port 3000.
- It has its own nginx site file; other sites' configs are not touched.
- Memory is capped at 512 MB (`mem_limit`), which suits a small VPS.

## 1. DNS

At the domain registrar for `goodwinsecuritybh.com`, create:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `<server IPv4>` | 3600 |
| A | `www` | `<server IPv4>` | 3600 |
| AAAA | `@`, `www` | `<server IPv6>` (only if the server has one) | 3600 |

Check propagation with `dig +short goodwinsecuritybh.com` before requesting HTTPS certificates.

Email DNS records (MX/SPF/DKIM) belong to whichever provider hosts the company mailbox. Add their SPF/DKIM so enquiry notifications sent via SMTP aren't marked as spam.

## 2. First deployment

On the server (Ubuntu with Docker + Docker Compose plugin + nginx):

```bash
# 1. Get the code
sudo mkdir -p /opt/goodwinsecurity && sudo chown $USER /opt/goodwinsecurity
git clone git@github.com:amalurajm-sys/goodwinsecurity.git /opt/goodwinsecurity
cd /opt/goodwinsecurity

# 2. Configure
cp .env.example .env
nano .env        # set SESSION_SECRET (openssl rand -base64 48), ADMIN_EMAIL, ADMIN_PASSWORD, SMTP_* if available
chmod 600 .env
mkdir -p data && sudo chown 1001:1001 data   # the container runs as UID 1001

# 3. Build and start
docker compose up -d --build
docker compose logs -f --tail=50          # wait for "Ready"
curl -I http://127.0.0.1:3010/            # expect HTTP/1.1 200
```

> **data folder ownership:** the container runs as the non-root user UID 1001. If startup logs show `SQLITE_CANTOPEN` or `EACCES`, run `sudo chown -R 1001:1001 data`.

### nginx + HTTPS

```bash
sudo cp deploy/nginx-goodwinsecuritybh.conf /etc/nginx/sites-available/goodwinsecuritybh.com
sudo ln -s /etc/nginx/sites-available/goodwinsecuritybh.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx        # only reloads; other sites keep running

sudo apt install -y certbot python3-certbot-nginx   # if not installed
sudo certbot --nginx -d goodwinsecuritybh.com -d www.goodwinsecuritybh.com --redirect
```

Certbot adds the HTTPS server block, the HTTP→HTTPS redirect and automatic renewal (`systemctl list-timers | grep certbot`).

Make sure nginx gzip is on (it is by default on Ubuntu: `gzip on;` in `/etc/nginx/nginx.conf`).

### First login
1. Open `https://goodwinsecuritybh.com/admin` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. The account is created on the first login attempt.
2. **Delete `ADMIN_PASSWORD` from `.env`**, then run `docker compose up -d`.
3. Go to **Admin → Company & homepage** and enter the verified phone, WhatsApp, email, address and map.
4. Replace or unpublish the sample products and projects.

To reset a forgotten password:
```bash
docker compose exec web node scripts/create-admin.mjs admin@example.com
```

## 3. Updating (deploy a new version)

```bash
cd /opt/goodwinsecurity
git pull
docker compose up -d --build
docker image prune -f
```

The database and uploads in `data/` are not touched by rebuilds.

## 4. Rollback

```bash
cd /opt/goodwinsecurity
git log --oneline -5                # find the last good commit
git checkout <commit>
docker compose up -d --build
# when fixed upstream: git checkout main && git pull && docker compose up -d --build
```

The database schema only ever adds tables or columns, so rolling back code doesn't need a database restore. If data was damaged, restore a backup (below).

## 5. Backups

Back up `data/` (database **and** uploaded images). A consistent online DB backup:

```bash
docker compose exec web node scripts/backup.mjs     # → data/backups/goodwin-<timestamp>.db (keeps last 14)
```

Daily cron on the host (`crontab -e`):
```
30 2 * * * cd /opt/goodwinsecurity && docker compose exec -T web node scripts/backup.mjs >> /var/log/goodwin-backup.log 2>&1
45 2 * * * tar czf /var/backups/goodwin-uploads-$(date +\%F).tgz -C /opt/goodwinsecurity/data uploads && find /var/backups -name 'goodwin-uploads-*' -mtime +14 -delete
```
Copy backups off the server regularly (e.g. with `rclone` or `scp` to another machine).

**Restore:** `docker compose down`, copy the backup over `data/goodwin.db` (and delete any `goodwin.db-wal` / `goodwin.db-shm`), then `docker compose up -d`.

## 6. Email (SMTP)

Without SMTP, enquiries are still **stored** and visible in the admin panel. To also email them, set these in `.env`:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false        # true for port 465
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM="GOODWIN SECURITY Website <noreply@goodwinsecuritybh.com>"
ENQUIRY_NOTIFY_EMAIL=sales@goodwinsecuritybh.com
```

Then run `docker compose up -d`, submit a test enquiry, and check that the admin enquiry page shows "Email notification: Sent".

## 7. Search Console
1. Add the property `https://goodwinsecuritybh.com` in Google Search Console and verify it with a DNS TXT record.
2. Submit `https://goodwinsecuritybh.com/sitemap.xml`.
3. Optionally create a Google Business Profile with the verified address and phone. This matters more for local Bahrain searches than on-page SEO.

## Troubleshooting

| Symptom | Fix |
|---|---|
| 502 Bad Gateway | `docker compose ps` / `docker compose logs web`; confirm port 3010 in nginx matches `GOODWIN_PORT` |
| Can't stay logged in | Site must be served over HTTPS (secure cookie). Check `X-Forwarded-Proto` is passed by nginx |
| Uploads fail with 413 | Raise `client_max_body_size` in the nginx site file |
| Enquiry says "Invalid request origin" | nginx must pass `Host $host` (included in the provided config) |
