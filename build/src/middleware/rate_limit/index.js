"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleRateLimit = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.exampleRateLimit = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 1000, // 1 minutes
    limit: 3, //3 ip per 1 miniutes
    message: {
        status: 429,
        message: "Too many requests, please try again later.",
    },
});
