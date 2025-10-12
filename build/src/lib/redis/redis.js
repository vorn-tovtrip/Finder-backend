"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = void 0;
const redis_1 = require("redis");
let redisClient = null;
let isConnected = false;
const getRedisClient = async () => {
    if (redisClient && isConnected) {
        return redisClient;
    }
    redisClient = (0, redis_1.createClient)({
        url: process.env.REDIS_URL || "redis://localhost:6379",
    });
    redisClient.on("error", (err) => {
        console.error("Redis Client Error:", err);
        isConnected = false;
    });
    if (!isConnected) {
        await redisClient.connect();
        isConnected = true;
        console.log("✅ Redis connected successfully");
    }
    return redisClient;
};
exports.getRedisClient = getRedisClient;
