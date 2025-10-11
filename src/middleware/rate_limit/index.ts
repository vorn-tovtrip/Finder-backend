import { rateLimit } from "express-rate-limit";
export const exampleRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  limit: 3, //3 ip per 1 miniutes
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});
