import { RequestHandler } from "express";
import { createUser, getUserByEmail, verifyPassword, getUserById } from "../utils/db";
import { generateToken, verifyToken } from "../utils/auth";
import { AuthResponse } from "@shared/api";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const handleRegister: RequestHandler = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  const existing = getUserByEmail(email);
  if (existing) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  const user = createUser(email, password);
  const accessToken = generateToken(user.id);
  const refreshToken = generateToken(user.id, 7 * 24 * 60 * 60 * 1000); // 7 days

  const response: AuthResponse = {
    success: true,
    message: "Registration successful",
    accessToken,
    refreshToken,
    user,
  };

  res.status(201).json(response);
};

export const handleLogin: RequestHandler = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = getUserByEmail(email);
  if (!user || !verifyPassword(user.id, password)) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const accessToken = generateToken(user.id);
  const refreshToken = generateToken(user.id, 7 * 24 * 60 * 60 * 1000);

  const response: AuthResponse = {
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
    user,
  };

  res.json(response);
};

export const handleRefreshToken: RequestHandler = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token is required",
    });
  }

  const verified = verifyToken(refreshToken);
  if (!verified) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }

  const user = getUserById(verified.userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  const newAccessToken = generateToken(user.id);

  res.json({
    success: true,
    message: "Token refreshed",
    accessToken: newAccessToken,
    user,
  });
};

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Missing or invalid authorization header",
    });
  }

  const token = authHeader.slice(7);
  const verified = verifyToken(token);

  if (!verified) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  req.userId = verified.userId;
  next();
};

export const adminMiddleware: RequestHandler = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const user = getUserById(req.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};
