# Git44 - Quick Start Guide

Get the git44 watermark removal platform up and running in 5 minutes.

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

Edit `.env` and add your ScraperAPI key:
```
SCRAPER_API_KEY_1=your_scraperapi_key_here
```

Get a free API key from [ScraperAPI.com](https://www.scraperapi.com)

### 3. Start Development Server
```bash
pnpm dev
```

The app will open at `http://localhost:3000`

### 4. Create Admin Account
```
Email: admin@git44.dev
Password: admin123
```

Or create a new account via the register page.

## 📱 Using the App

### As a Regular User

1. **Register/Login**: Create account or sign in
2. **Dashboard**: Paste a video URL (TikTok, Instagram, YouTube, etc.)
3. **Submit**: Click "Start Removal"
4. **Wait**: Watch real-time processing status
5. **Download**: Get your watermark-free video

### As a Developer

1. **Login** to your account
2. Go to **Developer API** menu
3. Copy your **API Key**
4. Use code examples (cURL, Node.js, Python, PHP)
5. Call `POST /api/v1/generate` with your video link

Example:
```bash
curl -X POST https://localhost:3000/api/v1/generate \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"link": "https://www.tiktok.com/video/123456"}'
```

### As an Admin

1. **Login** with admin account (admin@git44.dev / admin123)
2. Go to **Admin** menu
3. **ScraperAPI Keys**: Manage your API keys
4. **Users**: View user accounts and reset quotas
5. **Logs**: Monitor system activity
6. **Queue**: Track processing jobs

## 🎯 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | `/` | Landing page & features |
| Login | `/login` | User authentication |
| Register | `/register` | Create account |
| Dashboard | `/dashboard` | Process videos |
| History | `/history` | View past jobs |
| Developer | `/developer-api` | API docs & stats |
| Admin | `/admin` | System management |

## 🔌 API Endpoints

### Authentication
```bash
POST /api/auth/register     # Create account
POST /api/auth/login        # Sign in
POST /api/auth/refresh      # Refresh token
```

### Removal Jobs (Authenticated Users)
```bash
POST /api/removal/create         # Create job
GET /api/removal/{jobId}/status  # Get status
GET /api/removal/user/jobs       # List jobs
```

### Developer API (API Key)
```bash
POST /api/v1/generate            # Create removal
GET /api/v1/status/{taskId}      # Get status
GET /api/v1/stats                # Get stats
GET /api/v1/keys                 # List keys
```

### Admin API (Admin Only)
```bash
GET /api/admin/stats             # System stats
GET /api/admin/users             # All users
GET /api/admin/scraper-keys      # API keys
GET /api/admin/logs              # System logs
GET /api/admin/queue             # Queue status
PATCH /api/admin/scraper-keys/{id}  # Update key
```

## 🧪 Testing

### Create Test Account
1. Go to `/register`
2. Sign up with test credentials
3. Verify you see the dashboard

### Test Watermark Removal
1. Get a video link from TikTok/Instagram/YouTube
2. Paste into dashboard
3. Click "Start Removal"
4. Watch job status update
5. (Note: Will fail without real ScraperAPI key, but UI works)

### Test Admin Panel
1. Login as admin@git44.dev / admin123
2. Click "Admin" in navigation
3. View statistics, users, API keys, logs

## 📁 Project Structure

```
git44/
├── client/                    # Frontend React app
│   ├── pages/                # Page components
│   │   ├── Index.tsx         # Homepage
│   │   ├── Login.tsx         # Login page
│   │   ├── Register.tsx      # Registration
│   │   ├── Dashboard.tsx     # User dashboard
│   │   ├── History.tsx       # Job history
│   │   ├── DeveloperAPI.tsx  # Dev API panel
│   │   └── Admin.tsx         # Admin panel
│   ├── components/           # Reusable components
│   │   └── Navbar.tsx        # Navigation bar
│   ├── App.tsx               # Main app file
│   └── global.css            # Global styles
│
├── server/                    # Backend Express app
│   ├── routes/               # API route handlers
│   │   ├── auth.ts           # Auth endpoints
│   │   ├── removal.ts        # Job endpoints
│   │   ├── developer.ts      # Dev API endpoints
│   │   └── admin.ts          # Admin endpoints
│   ├── utils/                # Utilities
│   │   ├── auth.ts           # JWT utilities
│   │   ├── db.ts             # Database/storage
│   │   ├── queue.ts          # Job queue
│   │   ├── removesora.ts     # RemoveSora API
│   │   └── logger.ts         # Logging
│   └── index.ts              # Server entry point
│
├── shared/                    # Shared types
│   └── api.ts                # TypeScript interfaces
│
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind config
├── .env.example              # Environment template
├── README.md                 # Full documentation
├── IMPLEMENTATION.md         # What's included
└── QUICK_START.md            # This file
```

## 🎨 Customization

### Change App Name
1. Update `<title>` in `index.html`
2. Change logo text in `client/pages/Index.tsx`
3. Update brand in navbar

### Change Colors
Edit `client/global.css` color variables:
```css
:root {
  --primary: 190 100% 50%;      /* Cyan */
  --secondary: 198 89% 48%;      /* Blue */
  --background: 15 23% 6%;       /* Dark slate */
}
```

### Change Theme
1. Light theme: Modify `.dark` section in `global.css`
2. Custom fonts: Update `@import` in `global.css`
3. Add new colors: Update `tailwind.config.ts`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use different port
PORT=3001 pnpm dev
```

### ScraperAPI Errors
- Check API key is correct in `.env`
- Verify quota in ScraperAPI dashboard
- Check rate limits (add new key if needed)

### Database Errors
- In-memory database resets on server restart
- For persistence, connect to PostgreSQL (see README)

### Page Not Loading
- Check browser console for errors
- Ensure server is running: `pnpm dev`
- Clear browser cache and reload

## 📚 Next Steps

1. **Read Full Docs**: See `README.md` for complete documentation
2. **Deploy**: Host on Netlify/Vercel or Docker
3. **Add Database**: Replace in-memory storage with PostgreSQL
4. **Setup Payments**: Integrate Stripe for paid plans
5. **Monitor**: Setup Sentry for error tracking
6. **Scale**: Optimize for production load

## 💡 Pro Tips

### For Developers
- API examples in `/developer-api` page
- TypeScript for all code
- Use shared types from `@shared/api`

### For Admins
- Monitor queue in admin panel
- Check logs for errors
- Manage ScraperAPI keys
- Reset user quotas as needed

### For Users
- Shorter videos process faster
- Keep videos under 100MB
- Check history for past downloads
- Share your API key carefully (dev users)

## 🆘 Getting Help

### Resources
- API Docs: See `POST /api/v1/generate` section in README
- Code Examples: Found in `/developer-api` page
- Issues: Check GitHub issues
- Email: support@git44.dev

### Common Issues

**"Invalid URL"**
- Make sure URL is complete with `https://`
- URL must point directly to video

**"Quota Exceeded"**
- Check quota in dashboard stats
- Admin can reset quota in admin panel
- Upgrade plan if needed

**"Processing Failed"**
- Retry operation (usually succeeds)
- Check if video is still public
- Ensure ScraperAPI key is valid

## 🎯 Success Checklist

- [ ] Dependencies installed
- [ ] .env file created with ScraperAPI key
- [ ] Server running (`pnpm dev`)
- [ ] Homepage loading at localhost:3000
- [ ] Can register new account
- [ ] Can login with admin@git44.dev
- [ ] Can access dashboard
- [ ] Can view admin panel
- [ ] Can access developer API page

Once all items are checked, you're ready to go! 🚀

---

**Questions?** See README.md for detailed documentation or email support@git44.dev
