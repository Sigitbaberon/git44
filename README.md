# Git44 - Professional Watermark Removal Platform

A production-ready full-stack web application for professional watermark removal from videos. Built with React, Express, TypeScript, and TailwindCSS.

## Features

### 🎯 Core Features
- **Automatic Watermark Removal**: Remove watermarks from TikTok, Instagram, YouTube, Shorts, and more
- **Automatic ScraperAPI Key Rotation**: Intelligent key rotation with cooldown management
- **Async Job Queue System**: FIFO queue with multi-user concurrency and rate limiting
- **Real-time Status Tracking**: Live status updates with polling intervals of 3-5 seconds
- **User Quotas**: Flexible quota system with daily limits and developer tier management

### 👨‍💻 Developer Features
- **REST API**: Complete API for third-party integration
- **API Key Management**: Automatic key generation for new users
- **Rate Limiting**: Built-in rate limiting and quota tracking
- **Code Examples**: SDK examples for Node.js, Python, PHP, and cURL
- **Real-time Stats**: Usage statistics and quota monitoring

### 🛡️ Admin Features
- **ScraperAPI Key Management**: Add, remove, and manage API keys
- **User Management**: View users, reset quotas, suspend accounts
- **System Monitoring**: Real-time queue status, logs, and metrics
- **Advanced Logging**: Request logs, error logs, retry logs, cooldown tracking

### 🎨 UI/UX
- **Modern Dark Theme**: Professional Slate-900 color scheme with cyan accents
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Feedback**: Toast notifications, status badges, live progress
- **Intuitive Dashboard**: Clean interface for managing watermark removals

## Tech Stack

### Frontend
- **React 18** with React Router 6
- **TypeScript** for type safety
- **TailwindCSS 3** for styling
- **Vite** for fast development and builds
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Sonner** for toast notifications
- **TanStack Query** for data fetching

### Backend
- **Express.js** for REST API
- **TypeScript** for type safety
- **In-memory storage** (can be replaced with PostgreSQL/MongoDB)
- **JWT** for authentication
- **CORS** for cross-origin requests

### Deployment
- **Docker** ready
- **Node.js** compatible
- **Netlify/Vercel** deployment support

## Installation

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/git44.git
cd git44
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env and add your ScraperAPI keys
```

4. **Start development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Configuration

### Environment Variables

Key environment variables in `.env`:

```bash
# ScraperAPI Keys (get from https://www.scraperapi.com)
SCRAPER_API_KEY_1=sk_live_your_key_here

# RemoveSora API endpoint
REMOVESORA_API_URL=https://www.removesorawatermark.online/api/removesora

# Job Queue Configuration
MAX_CONCURRENT_JOBS=3
JOB_MAX_RETRIES=3
JOB_MAX_POLLS=8
```

## API Documentation

### Authentication

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "confirmPassword": "securepassword"
}

Response:
{
  "success": true,
  "accessToken": "token...",
  "refreshToken": "token...",
  "user": { ... }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "accessToken": "token...",
  "refreshToken": "token...",
  "user": { ... }
}
```

### Removal Jobs (Authenticated)

#### Create Job
```bash
POST /api/removal/create
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "link": "https://www.tiktok.com/video/123456"
}

Response:
{
  "id": "job-...",
  "userId": "user-...",
  "inputLink": "https://www.tiktok.com/video/123456",
  "outputLink": null,
  "status": "queued",
  "taskId": null,
  "retryCount": 0,
  "maxRetries": 3,
  "pollCount": 0,
  "maxPolls": 8,
  "error": null,
  "createdAt": "2024-...",
  "updatedAt": "2024-..."
}
```

#### Get Job Status
```bash
GET /api/removal/{jobId}/status
Authorization: Bearer <accessToken>

Response: { job object with current status }
```

#### Get User Jobs
```bash
GET /api/removal/user/jobs
Authorization: Bearer <accessToken>

Response: [ job objects ... ]
```

### Developer API (API Key Required)

#### Generate (Remove Watermark)
```bash
POST /api/v1/generate
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "link": "https://www.tiktok.com/video/123456"
}

Response:
{
  "status": "processing",
  "taskId": "job-...",
  "link": null
}
```

#### Get Status
```bash
GET /api/v1/status/{taskId}
Authorization: Bearer <API_KEY>

Response:
{
  "status": "success|processing|failed",
  "taskId": "job-...",
  "link": "https://..." or null,
  "error": "error message if failed"
}
```

#### Get Stats
```bash
GET /api/v1/stats
Authorization: Bearer <API_KEY>

Response:
{
  "totalRequests": 1247,
  "successCount": 1234,
  "failureCount": 13,
  "quotaUsed": 247,
  "quotaRemaining": 9753,
  "dailyUsed": 45,
  "dailyLimit": 100
}
```

### Admin API (Admin Auth Required)

#### Get System Stats
```bash
GET /api/admin/stats
Authorization: Bearer <adminToken>
```

#### Get All Users
```bash
GET /api/admin/users
Authorization: Bearer <adminToken>
```

#### Get ScraperAPI Keys
```bash
GET /api/admin/scraper-keys
Authorization: Bearer <adminToken>
```

#### Update ScraperAPI Key Status
```bash
PATCH /api/admin/scraper-keys/{keyId}
Authorization: Bearer <adminToken>
Content-Type: application/json

{
  "status": "active|limited|cooldown"
}
```

#### Get Logs
```bash
GET /api/admin/logs?type=error&limit=100
Authorization: Bearer <adminToken>
```

#### Get Queue Status
```bash
GET /api/admin/queue
Authorization: Bearer <adminToken>
```

## Architecture

### System Flow

1. **User Input**: User submits video URL via dashboard
2. **Queue**: Job is added to async FIFO queue
3. **Processing**: 
   - POST request to RemoveSora via ScraperAPI
   - Receives taskId
4. **Polling**: 
   - GET requests to RemoveSora every 3-5 seconds
   - Maximum 8 polling attempts
5. **Result**: 
   - Success: Return download link
   - Failure: Return error and retry up to 3 times
   - Final Failure: Mark job as failed

### Quota System

- Each user has total quota (e.g., 500 requests/month)
- Daily limit per user (e.g., 100 requests/day)
- Quota deducted when request is made (not on success)
- Admin can reset quotas

### ScraperAPI Key Rotation

When a key hits limits:
1. Mark key as "limited"
2. Try next available key
3. If all keys limited, enter 1-hour cooldown
4. After cooldown, keys return to "active"

### Error Handling

**Transient Errors** (Retry):
- Network timeouts
- Temporary API unavailability
- Rate limiting

**Permanent Errors** (Don't Retry):
- Invalid video URL
- Account suspension
- Invalid API key

## Development

### Project Structure
```
git44/
├── client/                 # React frontend
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities
│   ├── App.tsx            # Main app file
│   └── global.css         # Global styles
├── server/                # Express backend
│   ├── routes/            # API routes
│   ├── utils/             # Utilities (auth, db, queue, etc.)
│   └── index.ts           # Server entry point
├── shared/                # Shared types
│   └── api.ts             # API type definitions
└── package.json
```

### Running Tests
```bash
pnpm test
```

### Type Checking
```bash
pnpm typecheck
```

### Building
```bash
pnpm build
```

### Production
```bash
pnpm start
```

## Deployment

### Docker
```bash
# Build image
docker build -t git44 .

# Run container
docker run -p 3000:3000 git44
```

### Netlify/Vercel
The app is compatible with Netlify and Vercel deployment. Connect your repository and it will automatically deploy.

## Security Considerations

### Production Checklist
- [ ] Change JWT secrets in `.env`
- [ ] Use a real database (PostgreSQL/MongoDB)
- [ ] Implement bcrypt for password hashing
- [ ] Use HTTPS only
- [ ] Set proper CORS origins
- [ ] Enable rate limiting
- [ ] Implement request validation
- [ ] Add security headers
- [ ] Use environment secrets for API keys
- [ ] Enable logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@git44.dev
- Documentation: https://docs.git44.dev

## Roadmap

- [ ] Stripe integration for payments
- [ ] WebSocket support for real-time updates
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Batch processing API
- [ ] Desktop application
- [ ] Mobile app

## Credits

Built with love by the git44 team.

## Changelog

### v1.0.0 (2024-01-XX)
- Initial release
- Core watermark removal functionality
- Developer API
- Admin panel
- Real-time job queue
- ScraperAPI integration
