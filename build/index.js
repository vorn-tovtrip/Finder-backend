"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const env_1 = require("./src/config/env");
const lib_1 = require("./src/lib");
const io_1 = require("./src/lib/socket/io");
const server_1 = __importDefault(require("./src/server"));
const startServer = async () => {
    const app = (0, server_1.default)();
    const httpServer = http_1.default.createServer(app);
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*", // allow all origins
            methods: ["GET", "POST"],
            credentials: true, // allow cookies
        },
    });
    // 2. Connect to Redis
    await (0, lib_1.getRedisClient)();
    console.log("Redis has been established successfully.");
    // Setup socket.io events
    (0, io_1.setupChatSocket)(io);
    // Start server
    httpServer.listen(env_1.AppEnv.PORT, () => {
        console.log(`Express + Socket.IO running on port ${env_1.AppEnv.PORT}`);
    });
};
startServer();
exports.default = startServer;
