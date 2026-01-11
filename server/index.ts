import "dotenv/config";
import express from "express";
import cors from "cors";
import { initializeDb } from "./utils/db";

// Auth routes
import {
  handleRegister,
  handleLogin,
  handleRefreshToken,
  authMiddleware,
  adminMiddleware,
} from "./routes/auth";

// Removal job routes
import {
  handleCreateRemovalJob,
  handleGetRemovalJobStatus,
  handleGetUserRemovalJobs,
  handleGetQueueStats,
} from "./routes/removal";

// Developer API routes
import {
  verifyApiKey,
  handleDeveloperGenerate,
  handleDeveloperStatus,
  handleDeveloperStats,
  handleDeveloperApiKeys,
} from "./routes/developer";

// Admin routes
import {
  handleAdminStats,
  handleAdminUsers,
  handleAdminScraperKeys,
  handleAdminUpdateScraperKey,
  handleAdminLogs,
  handleAdminQueueStatus,
  handleAdminSystemStatus,
} from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize database
  initializeDb();

  // ===== PUBLIC ROUTES =====
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "pong" });
  });

  // ===== AUTH ROUTES =====
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/refresh", handleRefreshToken);

  // ===== REMOVAL JOB ROUTES (require authentication) =====
  app.post("/api/removal/create", authMiddleware, handleCreateRemovalJob);
  app.get(
    "/api/removal/:jobId/status",
    authMiddleware,
    handleGetRemovalJobStatus,
  );
  app.get("/api/removal/user/jobs", authMiddleware, handleGetUserRemovalJobs);
  app.get("/api/removal/queue/stats", handleGetQueueStats);

  // ===== DEVELOPER API ROUTES =====
  // POST /api/v1/generate - Create a removal job via API
  app.post("/api/v1/generate", verifyApiKey, handleDeveloperGenerate);

  // GET /api/v1/status/:taskId - Get job status via API
  app.get("/api/v1/status/:taskId", verifyApiKey, handleDeveloperStatus);

  // GET /api/v1/stats - Get developer stats
  app.get("/api/v1/stats", verifyApiKey, handleDeveloperStats);

  // GET /api/v1/keys - Get API keys
  app.get("/api/v1/keys", verifyApiKey, handleDeveloperApiKeys);

  // ===== ADMIN ROUTES =====
  // All admin routes require both authentication and admin role
  app.get(
    "/api/admin/stats",
    authMiddleware,
    adminMiddleware,
    handleAdminStats,
  );
  app.get(
    "/api/admin/users",
    authMiddleware,
    adminMiddleware,
    handleAdminUsers,
  );
  app.get(
    "/api/admin/scraper-keys",
    authMiddleware,
    adminMiddleware,
    handleAdminScraperKeys,
  );
  app.patch(
    "/api/admin/scraper-keys/:keyId",
    authMiddleware,
    adminMiddleware,
    handleAdminUpdateScraperKey,
  );
  app.get("/api/admin/logs", authMiddleware, adminMiddleware, handleAdminLogs);
  app.get(
    "/api/admin/queue",
    authMiddleware,
    adminMiddleware,
    handleAdminQueueStatus,
  );
  app.get(
    "/api/admin/system-status",
    authMiddleware,
    adminMiddleware,
    handleAdminSystemStatus,
  );

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return app;
}
