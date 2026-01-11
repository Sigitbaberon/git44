import { User, RemovalJob, ApiKey, UserQuota, ScraperApiConfig } from "@shared/api";
import { generateApiKey } from "./auth";

// In-memory storage (will be lost on server restart)
const users = new Map<string, User>();
const userPasswords = new Map<string, string>();
const removalJobs = new Map<string, RemovalJob>();
const userApiKeys = new Map<string, ApiKey[]>();
const userQuotas = new Map<string, UserQuota>();
const scraperApiKeys: ScraperApiConfig[] = [];

// Initialize with sample data
export function initializeDb() {
  // Add sample admin user
  const adminId = "admin-001";
  users.set(adminId, {
    id: adminId,
    email: "admin@git44.dev",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  userPasswords.set(adminId, "admin123"); // In production, use bcrypt

  // Initialize ScraperAPI keys
  scraperApiKeys.push({
    id: "key-001",
    apiKey: "sk_live_abc123def456",
    status: "active",
    usageCount: 1234,
    lastUsed: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    limitedAt: null,
    cooldownUntil: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  scraperApiKeys.push({
    id: "key-002",
    apiKey: "sk_live_def456ghi789",
    status: "limited",
    usageCount: 5678,
    lastUsed: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    limitedAt: new Date().toISOString(),
    cooldownUntil: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// User operations
export function createUser(email: string, password: string, role: "user" | "admin" = "user"): User {
  const id = "user-" + Date.now().toString(36);
  const user: User = {
    id,
    email,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  users.set(id, user);
  userPasswords.set(id, password); // In production, use bcrypt.hash()
  
  // Create quota
  userQuotas.set(id, {
    userId: id,
    totalQuota: 500,
    remainingQuota: 500,
    dailyLimit: 100,
    dailyUsed: 0,
    resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  });

  // Create API key
  const apiKey = generateApiKey(id);
  userApiKeys.set(id, [{
    id: "key-" + id,
    userId: id,
    key: apiKey,
    name: "Default API Key",
    lastUsed: null,
    createdAt: new Date().toISOString(),
  }]);

  return user;
}

export function getUserById(id: string): User | null {
  return users.get(id) || null;
}

export function getUserByEmail(email: string): User | null {
  for (const user of users.values()) {
    if (user.email === email) return user;
  }
  return null;
}

export function verifyPassword(userId: string, password: string): boolean {
  const stored = userPasswords.get(userId);
  // In production, use bcrypt.compare()
  return stored === password;
}

// Removal Job operations
export function createRemovalJob(userId: string, inputLink: string): RemovalJob {
  const id = "job-" + Date.now().toString(36);
  const job: RemovalJob = {
    id,
    userId,
    inputLink,
    outputLink: null,
    status: "queued",
    taskId: null,
    retryCount: 0,
    maxRetries: 3,
    pollCount: 0,
    maxPolls: 8,
    error: null,
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
    updatedAt: new Date().toISOString(),
  };

  removalJobs.set(id, job);
  
  // Deduct quota
  const quota = userQuotas.get(userId);
  if (quota && quota.remainingQuota > 0) {
    quota.remainingQuota--;
    quota.dailyUsed++;
    quota.updatedAt = new Date().toISOString();
  }

  return job;
}

export function getRemovalJob(jobId: string): RemovalJob | null {
  return removalJobs.get(jobId) || null;
}

export function updateRemovalJob(jobId: string, updates: Partial<RemovalJob>): RemovalJob | null {
  const job = removalJobs.get(jobId);
  if (!job) return null;

  const updated = { ...job, ...updates, updatedAt: new Date().toISOString() };
  removalJobs.set(jobId, updated);
  return updated;
}

export function getUserRemovalJobs(userId: string): RemovalJob[] {
  return Array.from(removalJobs.values()).filter(job => job.userId === userId);
}

// API Key operations
export function getUserApiKeys(userId: string): ApiKey[] {
  return userApiKeys.get(userId) || [];
}

export function getApiKeyByKey(key: string): ApiKey | null {
  for (const keys of userApiKeys.values()) {
    const found = keys.find(k => k.key === key);
    if (found) return found;
  }
  return null;
}

// Quota operations
export function getUserQuota(userId: string): UserQuota | null {
  return userQuotas.get(userId) || null;
}

// ScraperAPI Key operations
export function getScraperApiKeys(): ScraperApiConfig[] {
  return scraperApiKeys;
}

export function getActiveScraperApiKey(): ScraperApiConfig | null {
  return scraperApiKeys.find(key => key.status === "active") || null;
}

export function updateScraperApiKey(keyId: string, updates: Partial<ScraperApiConfig>): ScraperApiConfig | null {
  const index = scraperApiKeys.findIndex(k => k.id === keyId);
  if (index === -1) return null;

  scraperApiKeys[index] = { ...scraperApiKeys[index], ...updates, updatedAt: new Date().toISOString() };
  return scraperApiKeys[index];
}

export function markKeyAsLimited(keyId: string): ScraperApiConfig | null {
  return updateScraperApiKey(keyId, {
    status: "limited",
    limitedAt: new Date().toISOString(),
  });
}

export function markKeyAsCooldown(keyId: string, cooldownMinutes: number = 60): ScraperApiConfig | null {
  return updateScraperApiKey(keyId, {
    status: "cooldown",
    cooldownUntil: new Date(Date.now() + cooldownMinutes * 60 * 1000).toISOString(),
  });
}

// Get all users (for admin)
export function getAllUsers(): User[] {
  return Array.from(users.values());
}

export function getDbStats() {
  return {
    totalUsers: users.size,
    totalJobs: removalJobs.size,
    totalQuotas: userQuotas.size,
  };
}
