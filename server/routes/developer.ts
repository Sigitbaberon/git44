import { RequestHandler } from "express";
import {
  getApiKeyByKey,
  getUserQuota,
  getUserById,
  getRemovalJob,
  createRemovalJob,
  getUserApiKeys,
} from "../utils/db";
import { jobQueue } from "../utils/queue";
import { DeveloperGenerateResponse } from "@shared/api";

// Middleware to verify API key
export const verifyApiKey: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Missing or invalid API key",
    });
  }

  const apiKey = authHeader.slice(7);
  const keyRecord = getApiKeyByKey(apiKey);

  if (!keyRecord) {
    return res.status(401).json({
      success: false,
      message: "Invalid API key",
    });
  }

  req.userId = keyRecord.userId;
  next();
};

export const handleDeveloperGenerate: RequestHandler = (req, res) => {
  const userId = req.userId;
  const { link } = req.body;

  if (!userId) {
    return res.status(401).json({ status: "failed", error: "Invalid API key" });
  }

  if (!link) {
    return res
      .status(400)
      .json({ status: "failed", error: "Link is required" });
  }

  // Validate URL
  try {
    new URL(link);
  } catch {
    return res
      .status(400)
      .json({ status: "failed", error: "Invalid URL format" });
  }

  // Check quota
  const quota = getUserQuota(userId);
  if (!quota || quota.remainingQuota <= 0) {
    return res.status(429).json({ status: "failed", error: "Quota exceeded" });
  }

  // Create job
  const job = createRemovalJob(userId, link);

  // Enqueue for processing
  jobQueue.enqueue(job.id);

  const response: DeveloperGenerateResponse = {
    status: "processing",
    taskId: job.id,
    link: null,
  };

  res.status(202).json(response);
};

export const handleDeveloperStatus: RequestHandler = (req, res) => {
  const userId = req.userId;
  const { taskId } = req.params;

  if (!userId) {
    return res.status(401).json({ status: "failed", error: "Invalid API key" });
  }

  const job = getRemovalJob(taskId);
  if (!job) {
    return res.status(404).json({ status: "failed", error: "Task not found" });
  }

  // Verify ownership
  if (job.userId !== userId) {
    return res.status(403).json({ status: "failed", error: "Unauthorized" });
  }

  const response: DeveloperGenerateResponse = {
    status:
      job.status === "success"
        ? "success"
        : job.status === "failed"
          ? "failed"
          : "processing",
    taskId: job.id,
    link: job.outputLink || null,
  };

  if (job.status === "failed") {
    response.error = job.error || "Processing failed";
  }

  res.json(response);
};

export const handleDeveloperStats: RequestHandler = (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid API key",
    });
  }

  const user = getUserById(userId);
  const quota = getUserQuota(userId);
  const jobs = [];

  if (!user || !quota) {
    return res.status(500).json({
      success: false,
      message: "User or quota not found",
    });
  }

  const response = {
    totalRequests: quota.totalQuota - quota.remainingQuota,
    successCount: 0,
    failureCount: 0,
    quotaUsed: quota.totalQuota - quota.remainingQuota,
    quotaRemaining: quota.remainingQuota,
    dailyUsed: quota.dailyUsed,
    dailyLimit: quota.dailyLimit,
  };

  res.json(response);
};

export const handleDeveloperApiKeys: RequestHandler = (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid API key",
    });
  }

  const keys = getUserApiKeys(userId);
  res.json(keys);
};
