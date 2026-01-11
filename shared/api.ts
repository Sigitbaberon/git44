/**
 * Git44 Shared API Types
 * Shared types between client and server
 */

// ===== Auth & User Types =====
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

// ===== Quota & Dev API Types =====
export interface UserQuota {
  userId: string;
  totalQuota: number;
  remainingQuota: number;
  dailyLimit: number;
  dailyUsed: number;
  resetAt: string;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  userId: string;
  key: string;
  name: string;
  lastUsed: string | null;
  createdAt: string;
}

export interface DeveloperStats {
  totalRequests: number;
  successCount: number;
  failureCount: number;
  quotaUsed: number;
  quotaRemaining: number;
  dailyUsed: number;
  dailyLimit: number;
}

// ===== Job & Removal Types =====
export type JobStatus =
  | "queued"
  | "processing"
  | "polling"
  | "success"
  | "failed";

export interface RemovalJob {
  id: string;
  userId: string;
  inputLink: string;
  outputLink: string | null;
  status: JobStatus;
  taskId: string | null;
  retryCount: number;
  maxRetries: number;
  pollCount: number;
  maxPolls: number;
  error: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

export interface JobStatusUpdate {
  jobId: string;
  status: JobStatus;
  taskId?: string;
  outputLink?: string;
  error?: string;
  retryCount?: number;
  pollCount?: number;
}

// ===== API Developer Endpoints =====
export interface DeveloperGenerateRequest {
  link: string;
}

export interface DeveloperGenerateResponse {
  status: "processing" | "success" | "failed";
  taskId?: string;
  link?: string;
  error?: string;
}

// ===== ScraperAPI & RemoveSora Types =====
export interface ScraperApiConfig {
  id: string;
  apiKey: string;
  status: "active" | "limited" | "cooldown";
  usageCount: number;
  lastUsed: string | null;
  limitedAt: string | null;
  cooldownUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RemoveSoraInitResponse {
  taskId: string;
}

export interface RemoveSoraPollingResponse {
  status: "processing" | "success" | "failed";
  message?: string;
  link?: string;
  error?: string;
}

// ===== Admin Types =====
export interface AdminStats {
  totalUsers: number;
  activeUsers24h: number;
  totalJobs: number;
  successRate: number;
  failureRate: number;
  averageLatency: number;
  totalRequests: number;
  queuedJobs: number;
  processingJobs: number;
}

export interface AdminScraperKey {
  id: string;
  apiKey: string;
  status: "active" | "limited" | "cooldown";
  usageCount: number;
  successCount: number;
  failureCount: number;
  lastUsed: string | null;
  limitedAt: string | null;
  cooldownUntil: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "user" | "admin";
  totalQuota: number;
  quotaUsed: number;
  status: "active" | "suspended";
  jobsCount: number;
  createdAt: string;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  type:
    | "request"
    | "error"
    | "retry"
    | "cooldown"
    | "quota"
    | "api_usage"
    | "admin_action";
  userId?: string;
  jobId?: string;
  message: string;
  metadata?: Record<string, any>;
}

// ===== Example/Demo Types =====
export interface DemoResponse {
  message: string;
}
