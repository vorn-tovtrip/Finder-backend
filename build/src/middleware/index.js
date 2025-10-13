"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchemaMiddleware = exports.notFoundMiddleWare = exports.loggerMiddleware = exports.corsMiddleware = exports.catchAllErrorMiddleware = exports.authMiddleware = void 0;
const cors_1 = __importDefault(require("./cors"));
exports.corsMiddleware = cors_1.default;
const error_1 = __importDefault(require("./error"));
exports.catchAllErrorMiddleware = error_1.default;
const jwt_middleware_1 = require("./jwt/jwt.middleware");
Object.defineProperty(exports, "authMiddleware", { enumerable: true, get: function () { return jwt_middleware_1.authMiddleware; } });
const logger_1 = __importDefault(require("./logger"));
exports.loggerMiddleware = logger_1.default;
const notfound_1 = __importDefault(require("./notfound"));
exports.notFoundMiddleWare = notfound_1.default;
const zod_1 = require("./validation/zod");
Object.defineProperty(exports, "validateSchemaMiddleware", { enumerable: true, get: function () { return zod_1.validateSchemaMiddleware; } });
