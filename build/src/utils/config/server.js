"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeServer = void 0;
const __1 = __importDefault(require("../../.."));
const closeServer = () => {
    if (__1.default.listening) {
        __1.default.close((err) => {
            if (err) {
                console.error("Error during server shutdown:", err);
            }
            else {
                console.log("Server force shutdown");
            }
            process.exit(0);
        });
    }
    else {
        console.error("Server is not running, cannot shut it down.");
        process.exit(1);
    }
};
exports.closeServer = closeServer;
