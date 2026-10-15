# GOODWIN SECURITY W.L.L. — goodwinsecuritybh.com

Corporate website, product catalogue, quotation system and admin panel for GOODWIN SECURITY W.L.L., a security systems company in the Kingdom of Bahrain.

## Stack

| Part | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | One app for the public site, API and admin |
| Styling | Tailwind CSS 3, self-hosted Sora + Manrope fonts | No external font requests |
| Database | SQLite (better-sqlite3, WAL mode) | No extra database server; light enough for a 2 GB VPS |
| Auth | bcrypt password hashes + signed, httpOnly session cookie (jose, HS256) | No third-party service |
| Email | Nodemailer over SMTP (optional) | Works with any mailbox provider |
| Deployment | Docker Compose behind nginx | Same pattern as the other sites on the server |

## Features

- **Public pages:** Home, About, Products (search + category/brand filters), Product detail, Services, Brands, Projects, Contact, Request a Quote, Privacy Policy, Terms and Conditions, 404.
- **Quotation and enquiry system:** one reusable form for product prices, installation, maintenance and complete systems. Every submission is stored in the database with a reference number (e.g. `GW-261015-3FA9C1`) and emailed to the company when SMTP is configured.
- **Spam protection:** honeypot field, minimum fill time, per-IP rate limiting, same-origin check, and server-side validation with Zod.
- **Admin panel (`/admin`):**
  - Enquiries: view, set status (New → Contacted → Quotation Sent → Won/Closed), add internal notes.
  - Catalogue: products, categories and brands, including image uploads.
  - Content: services, projects with galleries, company details, homepage banner, About page text.
  - SEO: per-page titles and descriptions.
  - Users: Admin and Editor roles.
- **SEO:** unique titles and meta descriptions, canonical URLs, Open Graph image, `sitemap.xml`, `robots.txt`. Organization JSON-LD uses only details the admin has entered. Sample entries are `noindex` and left out of the sitemap.
- **Security:** CSP and other security headers, protected admin routes (middleware plus a server-side check), bcrypt hashing, login rate limiting, and upload validation by type, size and file signature (no SVG uploads). Secrets come only from environment variables.

### Sample content
Products and projects ship as clearly labelled **sample/placeholder** entries ("Sample listing" badge, model `SAMPLE-xxx`, specifications "To be confirmed"). No prices, stock levels, certifications, partnerships, addresses or phone numbers are invented. Contact details stay hidden until entered in **Admin → Company & homepage**. See [`COMPANY-INFO-NEEDED.md`](COMPANY-INFO-NEEDED.md).

## Local development

```bash
cp .env.example .env.local   # set SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
echo "INSECURE_COOKIES=true" >> .env.local   # allows admin login over http://localhost
npm install
npm run dev                  # http://localhost:3000, admin at /admin
```

The SQLite database and uploads are created in `./data/` on first run (ignored by git).

| Command | Purpose |
|---|---|
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run admin:create -- you@example.com` | Create or reset an admin user (prompts for a password) |
| `npm run backup` | Online backup of the database to `data/backups/` |
| `npm run art` | Regenerate `public/art/*.svg` after editing `src/components/ProductArt.tsx` |

## Project structure

```
src/app/(site)/        Public pages (shared header/footer layout)
src/app/admin/         Admin login, panel pages and server actions (actions.ts)
src/app/api/enquiries  Enquiry submission endpoint
src/app/uploads/       Serves uploaded images from DATA_DIR/uploads
src/components/        Header, Footer, Logo, EnquiryForm, UI helpers
src/lib/               db (schema), seed (initial content), queries, auth, mail, uploads, validation, SEO
deploy/                nginx site config
scripts/               admin creation, backups, illustration generator
```

## Replacing the logo
The logo is an inline SVG in `src/components/Logo.tsx`; the favicon is `public/icon.svg`. Replace both, and `public/og.png` (1200×630) for social sharing.

## Arabic / RTL
The layout is set up so an Arabic version can be added later:
- `<html lang dir>` is set in `src/app/layout.tsx`.
- Base styles include `[dir="rtl"]` handling.
- The design uses flex and grid with `gap` rather than left/right offsets.

A full Arabic version would add a locale segment (e.g. `/ar`) and translated content fields.

## Deployment
See [`DEPLOYMENT.md`](DEPLOYMENT.md).
