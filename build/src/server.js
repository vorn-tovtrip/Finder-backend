"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const express_session_1 = __importDefault(require("express-session"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const middleware_1 = require("./middleware");
const routes_1 = __importDefault(require("./routes"));
const createAppServer = () => {
    const app = (0, express_1.default)();
    app.use(middleware_1.loggerMiddleware, (0, morgan_1.default)("dev"));
    app.use((0, cors_1.default)());
    app.use((0, express_session_1.default)({
        saveUninitialized: false,
        resave: false,
        secret: "P@ss@123",
        proxy: process.env.NODE_ENV == "production" ? true : false,
        cookie: { secure: process.env.NODE_ENV == "production" ? true : false },
    }));
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
    }));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json());
    const globalRateLimit = (0, express_rate_limit_1.rateLimit)({
        windowMs: 15 * 60 * 1000,
        limit: 200,
        message: {
            status: 429,
            message: "Too many requests, please try again later.",
        },
    });
    app.use(globalRateLimit);
    app.get("/", (_, res) => {
        return res.send(`Welcome to Finder Backend ${process.env.NODE_ENV}`);
    });
    app.use("/api/v1/", routes_1.default);
    app.use(middleware_1.notFoundMiddleWare);
    app.use(middleware_1.catchAllErrorMiddleware);
    return app;
};
exports.default = createAppServer;
