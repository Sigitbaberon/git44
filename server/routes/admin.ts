import { RequestHandler } from "express";
import {
  getAllUsers,
  getScraperApiKeys,
  updateScraperApiKey,
  getUserQuota,
  getDbStats,
} from "../utils/db";
import { getSystemStatus } from "../utils/removesora";
import { AdminStats } from "@shared/api";

export const handleAdminStats: RequestHandler = async (req, res) => {
  const dbStats = getDbStats();
  const systemStatus = await getSystemStatus();

  const stats: AdminStats = {
    totalUsers: dbStats.totalUsers,
    activeUsers24h: Math.floor(dbStats.totalUsers * 0.7), // Mock data
    totalJobs: dbStats.totalJobs,
    successRate: 99.2,
    failureRate: 0.8,
    averageLatency: 2.4,
    totalRequests: dbStats.totalJobs,
    queuedJobs: 23,
    processingJobs: 8,
  };

  res.json(stats);
};

export const handleAdminUsers: RequestHandler = (req, res) => {
  const users = getAllUsers();

  const usersList = users.map((user) => {
    const quota = getUserQuota(user.id);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      totalQuota: quota?.totalQuota || 0,
      quotaUsed: quota ? quota.totalQuota - quota.remainingQuota : 0,
      status: "active" as const,
      jobsCount: Math.floor(Math.random() * 100), // Mock data
      createdAt: user.createdAt,
    };
  });

  res.json(usersList);
};

export const handleAdminScraperKeys: RequestHandler = (req, res) => {
  const keys = getScraperApiKeys();

  const formattedKeys = keys.map((key) => ({
    id: key.id,
    apiKey: key.apiKey.slice(0, 10) + "..." + key.apiKey.slice(-5), // Hide most of the key
    status: key.status,
    usageCount: key.usageCount,
    successCount: Math.floor(key.usageCount * 0.992), // Mock success rate
    failureCount: Math.floor(key.usageCount * 0.008),
    lastUsed: key.lastUsed,
    limitedAt: key.limitedAt,
    cooldownUntil: key.cooldownUntil,
  }));

  res.json(formattedKeys);
};

export const handleAdminUpdateScraperKey: RequestHandler = (req, res) => {
  const { keyId } = req.params;
  const { status } = req.body;

  if (!keyId || !status) {
    return res.status(400).json({
      success: false,
      message: "Key ID and status are required",
    });
  }

  const updated = updateScraperApiKey(keyId, { status: status as any });

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: "Key not found",
    });
  }

  res.json({
    success: true,
    message: "Key updated",
    key: updated,
  });
};

export const handleAdminLogs: RequestHandler = (req, res) => {
  const { type, limit = 100 } = req.query;

  // Mock logs
  const logs = [
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      type: "request",
      userId: "user-001",
      jobId: "job-123",
      message: "Job created: TikTok video",
      metadata: {},
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      type: "error",
      userId: "system",
      message: "ScraperAPI key limited",
      metadata: { keyId: "key-001" },
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      type: "retry",
      jobId: "job-456",
      message: "Job retry: Attempt 2/3",
      metadata: { retryCount: 2 },
    },
  ];

  const filtered = type ? logs.filter((log) => log.type === type) : logs;

  res.json(filtered.slice(0, Number(limit)));
};

export const handleAdminQueueStatus: RequestHandler = (req, res) => {
  // This would use jobQueue.getStats() in real implementation
  res.json({
    queued: 23,
    processing: 8,
    completed_today: 342,
    failed_today: 5,
  });
};

export const handleAdminSystemStatus: RequestHandler = async (req, res) => {
  const status = await getSystemStatus();

  res.json({
    scraperApiReady: status.scraperApiReady,
    removeSoraOnline: status.removeSoraOnline,
    activeScraperKey: status.activeKey,
    timestamp: new Date().toISOString(),
  });
};
