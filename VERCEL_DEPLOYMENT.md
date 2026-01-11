# Git44 - Tutorial Deployment dengan Vercel

Panduan lengkap untuk mendeploy aplikasi git44 ke Vercel (platform hosting modern untuk aplikasi fullstack).

## 📋 Prasyarat (Prerequisites)

Sebelum memulai, pastikan Anda memiliki:

- ✅ Akun GitHub (atau GitLab/Bitbucket)
- ✅ Akun Vercel (gratis di https://vercel.com)
- ✅ Repository git44 di GitHub
- ✅ Git terinstall di komputer lokal
- ✅ Node.js 18+ dan pnpm

## 🚀 Langkah 1: Persiapan Project Lokal

### 1.1 Push Project ke GitHub

```bash
# Jika belum ada repository GitHub
git init
git add .
git commit -m "Initial commit: git44 watermark removal platform"
git remote add origin https://github.com/username/git44.git
git branch -M main
git push -u origin main
```

### 1.2 Verifikasi Struktur Project

Pastikan project memiliki struktur yang benar:

```
git44/
├── client/                 # React frontend
├── server/                 # Express backend
├── shared/                 # Shared types
├── package.json            # Dependencies
├── pnpm-lock.yaml         # Lock file
├── vite.config.ts         # Vite config
├── vite.config.server.ts  # Server config
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind config
└── .env.example           # Environment template
```

### 1.3 Buat File Konfigurasi Vercel

Buat file `vercel.json` di root project:

```json
{
  "version": 2,
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "vite",
  "functions": {
    "server/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

## 🔧 Langkah 2: Konfigurasi Build

### 2.1 Update package.json Scripts

Pastikan `package.json` memiliki scripts yang tepat:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "vite build --config vite.config.server.ts",
    "start": "node dist/server/node-build.mjs",
    "test": "vitest --run",
    "typecheck": "tsc"
  }
}
```

### 2.2 Verifikasi Build Lokal

Sebelum deploy ke Vercel, test build lokal:

```bash
# Hapus build sebelumnya (jika ada)
rm -rf dist/

# Build project
pnpm run build

# Verifikasi output
ls -la dist/
```

Output yang diharapkan:

- `dist/spa/` - Frontend bundle
- `dist/server/` - Backend server

## 👤 Langkah 3: Setup Akun Vercel

### 3.1 Buat Akun Vercel

1. Kunjungi https://vercel.com/signup
2. Pilih "Continue with GitHub"
3. Authorize Vercel untuk akses repository
4. Selesaikan setup

### 3.2 Hubungkan GitHub Account

```
Dashboard Vercel → Settings → Git Configuration
├─ GitHub: Connected
├─ Access Scope: Personal and Organization repositories
└─ Deploy on push: Enabled
```

## 📦 Langkah 4: Deploy ke Vercel

### 4.1 Import Project

**Cara 1: Dari Dashboard Vercel**

1. Login ke https://vercel.com/dashboard
2. Klik "New Project" atau "Add New..."
3. Pilih "Import Git Repository"
4. Cari repository "git44"
5. Klik "Import"

**Cara 2: Dari CLI**

```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy project
vercel

# Follow the prompts
```

### 4.2 Configure Project Settings

Di halaman import Vercel:

**Project Name:**

- `git44` atau nama custom

**Framework:**

- Vercel akan auto-detect sebagai "Vite"

**Root Directory:**

- `.` (default, root folder)

**Build and Output Settings:**

- Build Command: `pnpm run build`
- Output Directory: `dist`
- Install Command: `pnpm install`

## 🔐 Langkah 5: Environment Variables

### 5.1 Set Environment Variables di Vercel

**Pergi ke: Project Settings → Environment Variables**

Tambahkan variables berikut:

```
# ScraperAPI Configuration
SCRAPER_API_KEY_1 = sk_live_your_key_here
SCRAPER_API_KEY_2 = sk_live_backup_key_here

# RemoveSora API
REMOVESORA_API_URL = https://www.removesorawatermark.online/api/removesora

# JWT Secrets (gunakan secrets yang kuat!)
JWT_SECRET = your-production-secret-key-change-this-randomly
JWT_REFRESH_SECRET = your-refresh-secret-key-change-this-randomly

# Application
NODE_ENV = production
PING_MESSAGE = pong

# Database (jika menggunakan)
DATABASE_URL = postgresql://user:password@host:port/database

# API Configuration
API_RATE_LIMIT_WINDOW_MS = 60000
API_RATE_LIMIT_MAX_REQUESTS = 100

# Job Queue
MAX_CONCURRENT_JOBS = 3
JOB_POLL_INTERVAL_MS = 2000
JOB_MAX_RETRIES = 3
JOB_MAX_POLLS = 8
JOB_POLL_INTERVAL_MIN_MS = 3000
JOB_POLL_INTERVAL_MAX_MS = 5000

# Features
ENABLE_ADMIN_PANEL = true
ENABLE_DEVELOPER_API = true

# Deployment
CORS_ORIGIN = https://git44.vercel.app
```

### 5.2 Set Secrets untuk Production

Di halaman Environment Variables, pilih "Production" untuk setiap variable yang sensitive:

- ✅ JWT_SECRET → Production only
- ✅ JWT_REFRESH_SECRET → Production only
- ✅ DATABASE_URL → Production only
- ✅ SCRAPER*API_KEY*\* → Production only

### 5.3 Verifikasi Environment Setup

Buat file `.env.production` lokal (jangan commit):

```bash
cp .env.example .env.production
# Edit .env.production dengan values yang sama di Vercel
```

## 🚀 Langkah 6: First Deployment

### 6.1 Trigger Deployment

Setelah set environment variables:

1. Klik tombol "Deploy" di Vercel dashboard
2. Tunggu build selesai (biasanya 3-5 menit)
3. Lihat logs untuk monitoring

### 6.2 Monitor Build Process

**Build Logs:**

```
✓ Running Build Command: pnpm run build
✓ Running Packages Build
  ✓ client build
  ✓ server build
✓ Linking Web Analytics
✓ Generated imagesizes.json
✓ Done
```

### 6.3 Verifikasi Deployment

Setelah deployment selesai:

1. Klik "Visit" untuk membuka live URL
2. Verifikasi homepage loading
3. Test login/register
4. Check browser console untuk errors

## 🔄 Langkah 7: Auto Deployment dengan Git

### 7.1 Enable Auto Deployment

**Settings → Git → Deployments**

```
Automatic Deployments: ON
├─ Production Branch: main
├─ Preview Deployments: All branches
├─ Skip Builds for: (optional)
└─ Comments: Enabled
```

### 7.2 Push Changes ke GitHub

```bash
# Make changes locally
git add .
git commit -m "Update: feature description"
git push origin main

# Vercel akan auto-deploy
# Monitor di: Dashboard → Deployments
```

### 7.3 Preview Deployments

Setiap PR akan mendapat preview URL:

```
✓ Preview: https://git44-preview-xxx.vercel.app
✓ Production: https://git44.vercel.app
```

## 📊 Langkah 8: Custom Domain

### 8.1 Add Custom Domain

**Settings → Domains**

```
1. Klik "Add Domain"
2. Masukkan domain (contoh: git44.dev)
3. Vercel akan provide DNS records
4. Update DNS di registrar domain
5. Wait for DNS propagation (15 min - 48 hours)
```

### 8.2 DNS Configuration

**Jika domain di Namecheap:**

```
1. Login ke Namecheap Dashboard
2. Domain → Manage
3. Advanced DNS
4. Add Records:

   Type: CNAME
   Host: www
   Value: cname.vercel-dns.com

   Type: A
   Host: @
   Value: 76.76.19.124
```

**Jika domain di Cloudflare:**

```
1. Add site di Cloudflare
2. Update nameservers di registrar
3. Tunggu propagation
4. Add CNAME ke Vercel subdomain (auto-detected)
```

### 8.3 SSL Certificate

✅ Vercel otomatis setup SSL dengan Let's Encrypt

- HTTPS enabled: ✓
- Auto-renew: ✓

## 🛠️ Langkah 9: Troubleshooting

### Build Failures

**Error: "Cannot find module"**

```bash
# Solusi 1: Clear cache
vercel env pull  # Pull env from Vercel

# Solusi 2: Check package.json
pnpm install --verbose

# Solusi 3: Check imports path
# Pastikan import path sesuai: @/components, @shared/api, etc.
```

**Error: "Build command failed"**

```bash
# Debug lokal
pnpm run build

# Check output
ls -la dist/

# Verify no errors di stderr
pnpm run typecheck
```

### Runtime Errors

**Error: "Cannot read property of undefined"**

```
Cause: Environment variable tidak loaded
Solution:
  1. Verify di Settings → Environment Variables
  2. Redeploy setelah add variables
  3. Check di /api/health endpoint
```

**Error: "Port already in use"**

```
Vercel menggunakan dynamic ports, bukan issue
Pastikan code tidak hardcode PORT 3000
```

### Database Connection Issues

```bash
# Test connection
curl https://your-domain.vercel.app/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2024-01-10T10:30:45.123Z"
}
```

## 📈 Langkah 10: Monitoring & Logs

### 10.1 Real-time Logs

**Dashboard → Deployments → [Latest] → Logs**

```
# View build logs
Vercel will show:
✓ Installing dependencies
✓ Running build command
✓ Generating bundle
✓ Uploading files
```

### 10.2 Web Analytics

**Settings → Analytics**

```
Enable:
├─ Core Web Vitals
├─ Real User Monitoring
├─ Custom Events (optional)
└─ Integrate with Sentry (optional)
```

### 10.3 Error Tracking dengan Sentry

```bash
# Install Sentry
npm install @sentry/react @sentry/tracing

# Setup in client/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

## 🔄 Langkah 11: Continuous Updates

### 11.1 Update Project

```bash
# Make changes
git add .
git commit -m "Update: description"
git push origin main

# Vercel auto-deploys
# Monitor at: vercel.com/dashboard
```

### 11.2 Rollback to Previous Version

**Deployments → [Previous] → Promote to Production**

```
1. Dashboard → Deployments
2. Cari deployment yang ingin di-rollback
3. Klik "..." → "Promote to Production"
4. Confirm
```

### 11.3 Environment Variables Updates

```bash
# Local change
# .env.example → tested locally
git add .env.example
git commit -m "Update env template"
git push origin main

# Vercel dashboard:
# Settings → Environment Variables → Update values
# Redeploy
```

## 📋 Pre-Deployment Checklist

Sebelum production deployment, verify:

- [ ] All tests passing: `pnpm test`
- [ ] TypeScript no errors: `pnpm typecheck`
- [ ] Build succeeds locally: `pnpm run build`
- [ ] No console errors when running dev
- [ ] Environment variables set di Vercel
- [ ] Database connection working (jika applicable)
- [ ] API endpoints responding (test `/api/health`)
- [ ] Frontend pages loading
- [ ] Login/register flow working
- [ ] Custom domain configured (jika applicable)
- [ ] SSL certificate active
- [ ] Sentry/monitoring setup (optional)
- [ ] Analytics enabled
- [ ] Error logging configured

## 🎯 Vercel Pricing

| Plan           | Price  | Features                                    |
| -------------- | ------ | ------------------------------------------- |
| **Free**       | $0/mo  | 100GB bandwidth, Git deployments, Analytics |
| **Pro**        | $20/mo | Unlimited bandwidth, Priority support       |
| **Enterprise** | Custom | SLA, Dedicated support                      |

### Bandwidth Limits

- Free: 100GB/month
- Pro: Unlimited
- Overages: $0.50/GB

## ✅ Deployment Complete!

Setelah follow langkah-langkah di atas:

```
✓ Aplikasi live di: https://git44.vercel.app
✓ Auto-deployment aktif
✓ Environment variables configured
✓ SSL enabled
✓ Monitoring setup
✓ Rollback capability available
```

## 📞 Support & Resources

### Official Documentation

- Vercel Docs: https://vercel.com/docs
- Deploy Documentation: https://vercel.com/docs/concepts/deployments/overview
- Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables

### Vercel Command Line

```bash
# Deploy
vercel deploy

# Production deploy
vercel --prod

# Pull environment variables
vercel env pull

# View logs
vercel logs
```

### Troubleshooting Links

- Build Errors: https://vercel.com/docs/platform/frequently-asked-questions
- Performance: https://vercel.com/docs/concepts/analytics/performance
- Security: https://vercel.com/docs/security

## 🎓 Advanced Topics

### Custom Build Configuration

Edit `vercel.json`:

```json
{
  "buildCommand": "pnpm run build",
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Custom-Header",
          "value": "my-value"
        }
      ]
    }
  ]
}
```

### Use Vercel KV for Caching

```typescript
// server/utils/cache.ts
import { kv } from "@vercel/kv";

export async function cache(key: string, value: any, ttl: number) {
  await kv.set(key, value, { ex: ttl });
}
```

### Database Hosting Options

**Recommended untuk production:**

1. **Vercel Postgres** (Built-in)

   ```bash
   vercel postgres:create
   ```

2. **Neon** (PostgreSQL)
   - Free tier: 3 projects
   - Dashboard: https://neon.tech

3. **MongoDB Atlas**
   - Free tier: 512MB storage
   - Dashboard: https://mongodb.com/atlas

4. **PlanetScale** (MySQL)
   - Free tier: 1GB storage
   - Dashboard: https://planetscale.com

## 🎉 Selesai!

Aplikasi git44 Anda sekarang **live di production** dengan:

- ✅ Auto-deployment dari GitHub
- ✅ Environment variables terenkripsi
- ✅ SSL/HTTPS enabled
- ✅ CDN global
- ✅ Monitoring dan analytics
- ✅ Easy rollback capability

**Untuk update berikutnya**, cukup push ke main branch, Vercel akan otomatis deploy!

---

**Pertanyaan?** Lihat resource links di atas atau hubungi Vercel Support: https://vercel.com/support
