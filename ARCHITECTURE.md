# Git44 System Architecture

Complete system design and data flow documentation.

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GIT44 PLATFORM                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (React)                      │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Homepage │ Auth │ Dashboard │ History │ Dev API │ │  │
│  │  │         Admin Panel │ Navigation Bar              │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                        ↓ HTTP/HTTPS                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    BACKEND (Express)                     │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │          API ROUTES                               │ │  │
│  │  │  Auth  │  Removal Jobs  │  Dev API  │  Admin     │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │          CORE SYSTEMS                             │ │  │
│  │  │  Job Queue  │  Auth  │  Logging  │  Rate Limit  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │          INTEGRATIONS                             │ │  │
│  │  │  RemoveSora  │  ScraperAPI  │  Database          │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ↓              ↓              ↓                       │
│     RemoveSora      ScraperAPI       Database                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Job Processing Flow

```
USER SUBMITS VIDEO
        ↓
   AUTHENTICATION
   ├─ Verify JWT Token
   └─ Get User ID
        ↓
   QUOTA CHECK
   ├─ Check Total Quota > 0
   ├─ Check Daily Limit Not Exceeded
   └─ Deduct 1 from Quota
        ↓
   CREATE JOB
   ├─ Generate Job ID
   ├─ Status: "queued"
   ├─ Store in Database
   └─ Add to Queue
        ↓
   ╔═════════════════════════════════════════════════════════╗
   ║            ASYNC JOB QUEUE (FIFO)                       ║
   ╠═════════════════════════════════════════════════════════╣
   ║  Max Concurrent: 3                                       ║
   ║  ┌─────────────────────────────────────────────────┐    ║
   ║  │ Job 1: Processing  │ Job 2: Polling │ Job 3...  │    ║
   ║  └─────────────────────────────────────────────────┘    ║
   ╚═════════════════════════════════════════════════════════╝
        ↓
   INITIALIZE TASK
   ├─ Get Active ScraperAPI Key
   ├─ POST to RemoveSora (via ScraperAPI)
   ├─ Receive taskId
   ├─ Status: "processing"
   └─ Update Job (taskId, startedAt)
        ↓
   POLLING PHASE
   ├─ Max Polls: 8
   ├─ Interval: 3-5 seconds
   ├─ GET from RemoveSora (via ScraperAPI)
   └─ Check Response
        ├─ "processing" → Continue polling
        ├─ "success" → Extract download link, finish
        └─ "failed" → Handle error
        ↓
   ╔════════════════════════════════════════╗
   ║   COMPLETION / ERROR HANDLING          ║
   ╠════════════════════════════════════════╣
   ║ SUCCESS:                               ║
   ║ ├─ Status: "success"                   ║
   ║ ├─ outputLink: set                     ║
   ║ ├─ completedAt: set                    ║
   ║ └─ Notify user                         ║
   ║                                        ║
   ║ RETRY (< Max Retries):                 ║
   ║ ├─ Retry Count++                       ║
   ║ ├─ Status: "queued"                    ║
   ║ ├─ Re-add to Queue                     ║
   ║ └─ Retry Attempt...                    ║
   ║                                        ║
   ║ FAILED (Max Retries Exceeded):         ║
   ║ ├─ Status: "failed"                    ║
   ║ ├─ error: set error message            ║
   ║ ├─ completedAt: set                    ║
   ║ └─ Notify user of failure              ║
   ╚════════════════════════════════════════╝
        ↓
   USER SEES RESULT
   ├─ Success: Download link + Preview
   ├─ Failed: Error message + Retry option
   └─ Processing: Status updates in real-time
```

## 🔑 ScraperAPI Key Rotation Flow

```
REMOVAL JOB STARTS
        ↓
NEED SCRAPER API KEY
        ↓
CHECK FOR ACTIVE KEY
├─ Find key with status "active"
└─ If found → use it
        ↓
IF KEY NOT FOUND / API FAILS (403/429)
        ↓
MARK KEY AS LIMITED
├─ Set status: "limited"
├─ Set limitedAt: timestamp
└─ Log event
        ↓
GET NEXT ACTIVE KEY
├─ Search all keys for status "active"
├─ If found → use it and retry
└─ If not found → enter cooldown
        ↓
ENTER COOLDOWN MODE (if all keys limited)
├─ Set all keys status: "cooldown"
├─ Set cooldownUntil: now + 60 minutes
├─ Queue job for retry later
└─ Log cooldown event
        ↓
AFTER COOLDOWN EXPIRES
├─ Set all limited keys: status "active"
├─ Clear limitedAt, cooldownUntil
├─ Process waiting jobs
└─ Normal operations resume
```

## 💾 Data Model Relationships

```
┌─────────────┐                  ┌──────────────────┐
│    USER     │──────┐           │   USER QUOTA     │
├─────────────┤      │           ├──────────────────┤
│ id          │      └──────────→│ userId (FK)      │
│ email       │                  │ totalQuota       │
│ password    │                  │ remainingQuota   │
│ role        │                  │ dailyLimit       │
│ createdAt   │                  │ dailyUsed        │
└─────────────┘                  └──────────────────┘
      │
      │ 1:N
      ↓
┌─────────────────────┐          ┌──────────────────┐
│  REMOVAL JOB        │          │   API KEY        │
├─────────────────────┤          ├──────────────────┤
│ id                  │──────┐   │ userId (FK)      │
│ userId (FK)         │      └──→│ key (unique)     │
│ inputLink           │          │ lastUsed         │
│ outputLink          │          │ createdAt        │
│ status              │          └──────────────────┘
│ taskId              │
│ retryCount          │
│ pollCount           │
│ error               │
│ createdAt           │
│ completedAt         │
└─────────────────────┘

┌──────────────────────────────┐
│  SCRAPER API KEY CONFIG      │
├──────────────────────────────┤
│ id                           │
│ apiKey                       │
│ status (active/limited/cd)   │
│ usageCount                   │
│ lastUsed                     │
│ limitedAt                    │
│ cooldownUntil                │
└──────────────────────────────┘
```

## 📊 Database Schema

### users

```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  role ENUM('user', 'admin'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### user_quotas

```sql
CREATE TABLE user_quotas (
  user_id VARCHAR PRIMARY KEY,
  total_quota INT,
  remaining_quota INT,
  daily_limit INT,
  daily_used INT,
  reset_at TIMESTAMP,
  created_at TIMESTAMP
);
```

### removal_jobs

```sql
CREATE TABLE removal_jobs (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  input_link VARCHAR NOT NULL,
  output_link VARCHAR,
  status ENUM('queued', 'processing', 'polling', 'success', 'failed'),
  task_id VARCHAR,
  retry_count INT DEFAULT 0,
  max_retries INT DEFAULT 3,
  poll_count INT DEFAULT 0,
  max_polls INT DEFAULT 8,
  error TEXT,
  created_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### api_keys

```sql
CREATE TABLE api_keys (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  key VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  last_used TIMESTAMP,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### scraper_api_keys

```sql
CREATE TABLE scraper_api_keys (
  id VARCHAR PRIMARY KEY,
  api_key VARCHAR UNIQUE NOT NULL,
  status ENUM('active', 'limited', 'cooldown'),
  usage_count INT DEFAULT 0,
  last_used TIMESTAMP,
  limited_at TIMESTAMP,
  cooldown_until TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🔐 Authentication Flow

```
USER REGISTRATION
        ↓
┌─────────────────────────────────┐
│ POST /api/auth/register         │
│ Body: {email, password}         │
└─────────────────────────────────┘
        ↓
VALIDATE INPUT
├─ Email format valid
├─ Password >= 8 chars
├─ Email not already registered
└─ Passwords match
        ↓
CREATE USER
├─ Hash password (bcrypt in prod)
├─ Create user record
├─ Initialize quota (500 requests)
├─ Generate API key
└─ Store in database
        ↓
GENERATE TOKENS
├─ Create JWT accessToken (24h expiry)
├─ Create JWT refreshToken (7d expiry)
└─ Return both to client
        ↓
CLIENT STORES TOKENS
├─ localStorage.setItem('accessToken', token)
├─ localStorage.setItem('refreshToken', token)
└─ Use in subsequent requests

───────────────────────────────────

USER LOGIN
        ↓
┌─────────────────────────────────┐
│ POST /api/auth/login            │
│ Body: {email, password}         │
└─────────────────────────────────┘
        ↓
VERIFY CREDENTIALS
├─ Find user by email
├─ Compare password hash
└─ Reject if no match
        ↓
GENERATE TOKENS
├─ Create new JWT tokens
└─ Return to client
        ↓
AUTHENTICATED REQUESTS
        ↓
┌─────────────────────────────────┐
│ GET /api/removal/user/jobs      │
│ Header: Authorization: Bearer X │
└─────────────────────────────────┘
        ↓
VERIFY TOKEN
├─ Extract token from header
├─ Decode and verify JWT
├─ Check expiry
└─ Extract userId
        ↓
PROCESS REQUEST
├─ Use userId to fetch user data
└─ Return authorized result
```

## 🚀 Deployment Architecture

```
┌──────────────────────────────────────────────────┐
│         CLIENT BROWSER / APP                     │
│  React SPA (Client-Side Rendering)               │
└────────────────────┬─────────────────────────────┘
                     │ HTTPS
                     ↓
┌──────────────────────────────────────────────────┐
│      API GATEWAY / REVERSE PROXY                 │
│  (Nginx / CloudFlare / Load Balancer)            │
└────────────────────┬─────────────────────────────┘
                     │ HTTP
                     ↓
┌──────────────────────────────────────────────────┐
│  GIT44 APPLICATION SERVER                        │
│  ┌────────────────────────────────────────────┐  │
│  │ Node.js + Express                          │  │
│  │ - API Routes                               │  │
│  │ - Authentication                           │  │
│  │ - Job Queue                                │  │
│  │ - Logging                                  │  │
│  └────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────┘
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    ┌────────┐  ┌─────────┐  ┌──────────┐
    │Database│  │ScraperAPI│  │RemoveSora│
    │(Pg/Mongo)│  │API       │  │API       │
    └────────┘  └─────────┘  └──────────┘
```

## 📈 Performance Considerations

### Queue Optimization

- **Concurrency**: Max 3 jobs simultaneously
- **FIFO**: Fair processing for all users
- **Rate Limiting**: Quota system prevents abuse

### Database

- **In-Memory**: Fast for development
- **PostgreSQL**: Recommended for production
- **Indexes**: userId, jobId, status for quick lookups

### API Performance

- **Caching**: Use ETags for GET requests
- **Compression**: GZIP enabled
- **Pagination**: For large result sets
- **Rate Limiting**: Per-user + global limits

### Frontend Optimization

- **Code Splitting**: Route-based splitting with React
- **Lazy Loading**: Components loaded on demand
- **Caching**: HTTP caching headers
- **CDN**: Serve static assets from CDN

## 🔒 Security Measures

### Authentication

- JWT tokens with expiration
- Refresh token rotation
- Password hashing (bcrypt)
- CORS enabled

### Authorization

- Role-based access (user/admin)
- API key verification
- User ownership checks
- Admin-only endpoints protected

### API Security

- Input validation
- SQL injection prevention (parameterized queries)
- CSRF tokens (when needed)
- Rate limiting
- Request timeout

### Data Protection

- Encrypted passwords
- Environment variable secrets
- No sensitive data in logs
- HTTPS enforced in production

## 🧪 Testing Architecture

```
UNIT TESTS
├─ Utils functions
├─ Auth logic
├─ Queue logic
└─ Data models

INTEGRATION TESTS
├─ API endpoints
├─ Auth flow
├─ Job creation
└─ Queue processing

E2E TESTS
├─ User registration
├─ Job processing
├─ Dashboard functionality
└─ Admin operations
```

## 📊 Monitoring & Observability

### Metrics

- Request count per endpoint
- Job success/failure rate
- Average processing time
- Queue depth
- User quota usage
- API key usage

### Logging

- Request/response logs
- Error logs with stack traces
- Job lifecycle logs
- API key rotation logs
- Admin action logs

### Alerts

- High error rate
- Queue backup
- API key all limited
- System down
- Quota exhaustion

---

This architecture is designed for:

- **Scalability**: Add more job queue workers
- **Reliability**: Error handling and retries
- **Maintainability**: Clean separation of concerns
- **Security**: Multiple layers of protection
- **Performance**: Optimized data flow

For production deployment, consider:

- Load balancing
- Database replication
- Caching layer (Redis)
- Message queue (RabbitMQ)
- Monitoring (Prometheus/Grafana)
- Error tracking (Sentry)
