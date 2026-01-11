# Git44 - Vercel Deployment Quick Guide

Panduan singkat dan cepat untuk deploy ke Vercel (5 menit!).

## ⚡ Super Quick Start (5 Menit)

### Step 1: Push ke GitHub (2 menit)

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Import di Vercel (2 menit)

1. Buka https://vercel.com/new
2. Klik "Import Git Repository"
3. Paste URL: `https://github.com/username/git44`
4. Klik "Import"

### Step 3: Set Environment Variables (1 menit)

```
Di Vercel Dashboard → Settings → Environment Variables
Tambahkan:

SCRAPER_API_KEY_1 = sk_live_your_key_here
JWT_SECRET = your-secret-key
JWT_REFRESH_SECRET = your-refresh-secret
```

### ✅ Selesai!

Klik "Deploy" dan tunggu 2-3 menit. Aplikasi Anda live! 🎉

---

## 🚀 Step-by-Step Visual Guide

```
┌─────────────────────────────────────────────────┐
│  1. PERSIAPKAN PROJECT LOKAL                    │
├─────────────────────────────────────────────────┤
│                                                   │
│  $ pnpm run build                               │
│  ✓ Build successful                             │
│                                                   │
│  $ git add .                                    │
│  $ git commit -m "Deploy ready"                 │
│  $ git push origin main                         │
│                                                   │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│  2. BUKA VERCEL & IMPORT PROJECT                │
├─────────────────────────────────────────────────┤
│                                                   │
│  https://vercel.com/new                         │
│  ↓                                              │
│  "Import Git Repository"                        │
│  ↓                                              │
│  Paste: https://github.com/you/git44            │
│  ↓                                              │
│  "Import"                                       │
│                                                   │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│  3. CONFIGURE PROJECT SETTINGS                  │
├─────────────────────────────────────────────────┤
│                                                   │
│  Project Name: git44                            │
│  Framework: Vite (auto-detected)                │
│  Build Command: pnpm run build                  │
│  Output Directory: dist                         │
│                                                   │
│  ✓ Click "Deploy"                              │
│                                                   │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│  4. SET ENVIRONMENT VARIABLES                   │
├─────────────────────────────────────────────────┤
│                                                   │
│  Settings → Environment Variables               │
│  ┌──────────────────────────────────────────┐   │
│  │ SCRAPER_API_KEY_1 | sk_live_...  │ Prod │   │
│  │ JWT_SECRET        | secret...    │ Prod │   │
│  │ NODE_ENV          | production   │ Prod │   │
│  └──────────────────────────────────────────┘   │
│                                                   │
│  ✓ Save                                        │
│  ✓ Redeploy                                    │
│                                                   │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│  5. APLIKASI LIVE! ✅                           │
├─────────────────────────────────────────────────┤
│                                                   │
│  Production: https://git44.vercel.app           │
│                                                   │
│  Setiap git push ke main → auto deploy! 🚀     │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

## 📋 Deployment Checklist

Sebelum klik "Deploy":

```
□ Local build berhasil: pnpm run build
□ Tidak ada TypeScript errors: pnpm typecheck
□ Tidak ada console errors saat pnpm dev
□ Push ke GitHub: git push origin main
□ Vercel sudah connected ke GitHub account
□ Build command sudah benar: pnpm run build
□ Output directory sudah benar: dist
```

Setelah Deploy:

```
□ Build completed di Vercel dashboard
□ Live URL accessible: https://git44.vercel.app
□ Homepage loading tanpa errors
□ Klik "Visit" berfungsi
□ Environment variables akan di-set setelah deployment pertama
```

---

## 🔧 Environment Variables Essentials

**Yang WAJIB:**

```
SCRAPER_API_KEY_1 = sk_live_xxxxx        # Required untuk API
JWT_SECRET = very-secret-key              # Required untuk auth
JWT_REFRESH_SECRET = another-secret       # Required untuk refresh
NODE_ENV = production                     # Required untuk prod
```

**Yang Optional (tapi disarankan):**

```
REMOVESORA_API_URL = https://www.removesorawatermark.online/api/removesora
MAX_CONCURRENT_JOBS = 3
JOB_MAX_RETRIES = 3
```

---

## 🌐 Custom Domain Setup (Optional)

Jika mau domain custom seperti `git44.com`:

### 1. Beli Domain

- Namecheap, GoDaddy, atau registrar lain
- Harga: ~$10-15/tahun

### 2. Di Vercel Dashboard

```
Settings → Domains → "Add Domain"
Masukkan: git44.com
```

### 3. Update DNS di Registrar

```
Type: A Record
Name: @
Value: 76.76.19.124

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4. Tunggu DNS Propagate

- Biasanya: 15 menit - 48 jam
- Check: https://dnschecker.org

---

## 🔄 Auto-Deployment dari Git

```
Local Development:
  ↓ (git push origin main)
GitHub Repository
  ↓ (webhook trigger)
Vercel Deployment
  ↓ (automatic build)
Production Live
```

**Workflow:**

```bash
# Make changes locally
nano client/pages/Index.tsx

# Test lokal
pnpm dev

# Push ke GitHub
git add .
git commit -m "Update: feature X"
git push origin main

# Vercel otomatis deploy! 🚀
# Monitor di: https://vercel.com/dashboard
```

---

## 📊 Deployment Status

**Cara Cek Status Deployment:**

```
https://vercel.com/dashboard
  ↓
Klik project "git44"
  ↓
Lihat tab "Deployments"
  ↓
Status:
  🟦 Building...
  🟩 Ready → Production Live
  🔴 Failed → Check logs
```

---

## 🆘 Troubleshooting Cepat

| Problem                 | Solusi                                    |
| ----------------------- | ----------------------------------------- |
| Build gagal             | Cek: `pnpm run build` lokal dulu          |
| Module not found        | Pastikan `pnpm-lock.yaml` ter-push ke git |
| Env variables undefined | Redeploy setelah set variables            |
| CORS error              | Set `CORS_ORIGIN` di env var              |
| 502 Bad Gateway         | Tunggu 1-2 menit, refresh page            |

---

## 💡 Tips & Tricks

### Tip 1: Preview Deployments

Setiap PR akan dapat preview URL:

```
✓ https://git44-pr-123.vercel.app
```

Test sebelum merge!

### Tip 2: Rollback Cepat

Jika ada issue:

```
Dashboard → Deployments
Cari deployment sebelumnya
Klik "..." → "Promote to Production"
```

### Tip 3: View Logs

```
Deployments → [Deployment Name] → "Logs"
Lihat output build dan runtime logs
```

### Tip 4: Performance Monitoring

```
Settings → Analytics
Lihat real-time performance metrics
```

---

## 📱 Test After Deployment

Setelah deploy, test ini:

```
✓ Buka homepage: https://git44.vercel.app
  → Harus loading, tidak ada 404

✓ Test API: https://git44.vercel.app/api/ping
  → Response: {"message":"pong"}

✓ Test Register: /register
  → Form loading, validation bekerja

✓ Test Login: /login
  → Form loading, validasi bekerja

✓ Test Dashboard: /dashboard (setelah login)
  → Real-time job tracking bekerja

✓ Test Admin: /admin
  → Admin panel loading (jika sudah login admin)
```

---

## 🎯 Deployment Scenarios

### Scenario 1: Fresh Deploy (First Time)

```
1. Push code to GitHub ✓
2. Open Vercel.com/new ✓
3. Import git44 repo ✓
4. Configure settings ✓
5. Add environment variables ✓
6. Click Deploy ✓
7. Wait 2-3 minutes ✓
8. Application live! 🎉
```

### Scenario 2: Update Code

```
1. Make changes locally ✓
2. Test with: pnpm dev ✓
3. Commit: git commit -m "..." ✓
4. Push: git push origin main ✓
5. Vercel auto-deploys ✓
6. Check dashboard.vercel.com ✓
```

### Scenario 3: Update Environment Variable

```
1. Vercel Dashboard → Settings → Env Variables ✓
2. Update/add variable ✓
3. Dashboard → Deployments → [Latest] ✓
4. Click "Redeploy" ✓
```

---

## ✅ Success Indicators

Deployment berhasil jika:

```
✅ Deployment page shows "Ready"
✅ Live URL accessible
✅ Homepage loads
✅ No 500 errors in Logs
✅ Environment variables loaded
✅ API endpoints responding
✅ Database connected (if applicable)
```

---

## 📞 Quick Support

**Jika ada masalah:**

1. **Check Vercel Logs**

   ```
   Dashboard → Deployments → [Latest] → Logs
   ```

2. **Check Browser Console**

   ```
   F12 → Console tab
   Lihat error messages
   ```

3. **Test Lokal Dulu**

   ```
   pnpm run build
   pnpm start
   ```

4. **Contact Support**
   - Vercel: https://vercel.com/support
   - GitHub: Issues di repo

---

## 🎓 Next Steps

Setelah deployment berhasil:

1. **Setup Custom Domain** (optional)
   - Lebih profesional
   - Tutorial ada di VERCEL_DEPLOYMENT.md

2. **Add Analytics**
   - Settings → Analytics
   - Monitor performa

3. **Configure Monitoring**
   - Setup Sentry untuk error tracking
   - Setup New Relic untuk performance

4. **Setup CI/CD**
   - Auto-test sebelum deploy
   - Guna GitHub Actions

5. **Database Integration**
   - PostgreSQL dengan Vercel Postgres
   - Atau Neon/PlanetScale

---

## 📖 Full Documentation

Untuk detail lengkap, baca: **VERCEL_DEPLOYMENT.md**

Topik yang dicover:

- Environment variables detailed
- Custom domain setup
- Monitoring & analytics
- Advanced configuration
- Database setup
- Error troubleshooting
- CI/CD integration
- Production best practices

---

## 🎉 Congratulations!

Aplikasi **git44** Anda sekarang **live di production** dengan:

✅ Global CDN  
✅ Auto-scaling  
✅ SSL/HTTPS  
✅ Automatic deployments  
✅ Preview deployments  
✅ Analytics & monitoring  
✅ Rollback capability

**Setiap `git push` ke main = instant deployment!** 🚀

---

**Butuh bantuan?** Lihat file dokumentasi lengkap:

- `VERCEL_DEPLOYMENT.md` - Tutorial lengkap
- `README.md` - Project overview
- `QUICK_START.md` - Local setup
