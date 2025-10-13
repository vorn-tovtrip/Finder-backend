"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwtAndStore = exports.getUserFromRequest = exports.signJwt = exports.verifyJwt = exports.extractTokenFromHeader = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lib_1 = require("../../lib");
const constant_1 = require("../../constant");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
/**
 * Extract JWT token from Authorization header
 */
const extractTokenFromHeader = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return null;
    return authHeader.split(" ")[1];
};
exports.extractTokenFromHeader = extractTokenFromHeader;
/**
 * Verify and decode a JWT token
 */
const verifyJwt = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null; // or throw error if you prefer strict handling
    }
};
exports.verifyJwt = verifyJwt;
/**
 * Generate (sign) a JWT token
 */
const signJwt = (payload, options) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: "14d",
        algorithm: "HS256",
        ...options,
    });
};
exports.signJwt = signJwt;
/**
 * Helper: Extract and verify JWT from request
 */
const getUserFromRequest = async (req) => {
    const token = (0, exports.extractTokenFromHeader)(req);
    if (!token)
        return null;
    const redisClient = await (0, lib_1.getRedisClient)();
    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist_token:${token}`);
    if (isBlacklisted)
        return null;
    // Verify JWT signature
    const payload = (0, exports.verifyJwt)(token);
    if (!payload)
        return null;
    //Check if token exists in active Redis list
    const userToken = await redisClient.get(`access_token:${payload.userId}:${token}`);
    if (!userToken)
        return null;
    return payload;
};
exports.getUserFromRequest = getUserFromRequest;
const generateJwtAndStore = async ({ userId, email, }) => {
    const token = (0, exports.signJwt)({ userId: userId, email: email });
    const redis = await (0, lib_1.getRedisClient)();
    await redis.set(`access_token:${userId}:${token}`, "active", {
        EX: constant_1.TOKEN_EXPIRATION,
    });
    return token;
};
exports.generateJwtAndStore = generateJwtAndStore;
