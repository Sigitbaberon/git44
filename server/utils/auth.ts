import { User, AuthResponse } from "@shared/api";

// Simple JWT-like token creation (in production, use jsonwebtoken library)
export function generateToken(
  userId: string,
  expiresIn: number = 24 * 60 * 60 * 1000,
): string {
  const payload = {
    userId,
    iat: Date.now(),
    exp: Date.now() + expiresIn,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString());
    if (payload.exp < Date.now()) {
      return null;
    }
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export function generateApiKey(userId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `git44_sk_${timestamp}${random}`;
}
