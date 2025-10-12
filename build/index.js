"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./src/config/env");
const lib_1 = require("./src/lib");
const server_1 = __importDefault(require("./src/server"));
const app = (0, server_1.default)();
let redisClient;
const redisConnect = async () => {
    try {
        await (0, lib_1.getRedisClient)();
        console.log("Redis has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
redisConnect();
const server = app.listen(env_1.AppEnv.PORT, async () => {
    console.log("Welcome to express is startings");
});
server.on("connect", (req) => {
    console.log("Express js server is up running");
});
exports.default = server;
