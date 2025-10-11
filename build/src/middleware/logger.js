"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggerMiddleware = (req, res, next) => {
    console.log("Request Path Url:", req.path);
    console.log("Request Header:", req.header.name);
    console.log("Host name:", req.hostname);
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
};
exports.default = loggerMiddleware;
