import { RequestHandler } from "express";
import { createRemovalJob, getRemovalJob, getUserRemovalJobs, getUserQuota } from "../utils/db";
import { jobQueue } from "../utils/queue";

export const handleCreateRemovalJob: RequestHandler = (req, res) => {
  const userId = req.userId;
  const { link } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!link) {
    return res.status(400).json({
      success: false,
      message: "Video link is required",
    });
  }

  // Validate URL
  try {
    new URL(link);
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid URL format",
    });
  }

  // Check quota
  const quota = getUserQuota(userId);
  if (!quota || quota.remainingQuota <= 0) {
    return res.status(429).json({
      success: false,
      message: "Quota exceeded. Please upgrade your plan.",
    });
  }

  // Create job
  const job = createRemovalJob(userId, link);

  // Enqueue for processing
  jobQueue.enqueue(job.id);

  res.status(201).json(job);
};

export const handleGetRemovalJobStatus: RequestHandler = (req, res) => {
  const userId = req.userId;
  const { jobId } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const job = getRemovalJob(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  // Verify ownership
  if (job.userId !== userId) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  res.json(job);
};

export const handleGetUserRemovalJobs: RequestHandler = (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const jobs = getUserRemovalJobs(userId);
  res.json(jobs);
};

export const handleGetQueueStats: RequestHandler = (req, res) => {
  const stats = jobQueue.getStats();
  res.json(stats);
};
