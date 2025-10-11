"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAllErrorMiddleware = exports.notFoundMiddleWare = exports.corsMiddleware = exports.loggerMiddleware = void 0;
const logger_1 = __importDefault(require("./logger"));
exports.loggerMiddleware = logger_1.default;
const cors_1 = __importDefault(require("./cors"));
exports.corsMiddleware = cors_1.default;
const error_1 = __importDefault(require("./error"));
exports.catchAllErrorMiddleware = error_1.default;
const notfound_1 = __importDefault(require("./notfound"));
exports.notFoundMiddleWare = notfound_1.default;
__exportStar(require("./validation/index"), exports);
__exportStar(require("./rate_limit/index"), exports);
