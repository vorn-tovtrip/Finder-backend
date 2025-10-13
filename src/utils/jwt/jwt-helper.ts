import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { Request } from "express";
import { getRedisClient } from "../../lib";
import { TOKEN_EXPIRATION } from "../../constant";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Extract JWT token from Authorization header
 */
export const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  return authHeader.split(" ")[1];
};

/**
 * Verify and decode a JWT token
 */
export const verifyJwt = <T extends JwtPayload>(token: string): T | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    return null; // or throw error if you prefer strict handling
  }
};

/**
 * Generate (sign) a JWT token
 */
export const signJwt = (payload: object, options?: SignOptions): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "14d",
    algorithm: "HS256",
    ...options,
  });
};

/**
 * Helper: Extract and verify JWT from request
 */
export const getUserFromRequest = async <T extends JwtPayload>(
  req: Request
): Promise<T | null> => {
  const token = extractTokenFromHeader(req);
  if (!token) return null;

  const redisClient = await getRedisClient();

  // Check if token is blacklisted
  const isBlacklisted = await redisClient.get(`blacklist_token:${token}`);
  if (isBlacklisted) return null;
  // Verify JWT signature
  const payload = verifyJwt<T>(token);
  if (!payload) return null;
  //Check if token exists in active Redis list
  const userToken = await redisClient.get(
    `access_token:${payload.userId}:${token}`
  );
  if (!userToken) return null;

  return payload;
};

export const generateJwtAndStore = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  const token = signJwt({ userId: userId, email: email });
  const redis = await getRedisClient();
  await redis.set(`access_token:${userId}:${token}`, "active", {
    EX: TOKEN_EXPIRATION,
  });

  return token;
};
