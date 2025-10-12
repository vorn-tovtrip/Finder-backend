import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;
let isConnected = false;

export const getRedisClient = async () => {
  if (redisClient && isConnected) {
    return redisClient;
  }

  redisClient = createClient({
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
