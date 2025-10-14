"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const types_1 = require("../../types");
exports.authenticationSchema = zod_1.default.object({
    username: zod_1.default
        .string()
        .min(3, "Username must be at least 3 characters")
        .optional(),
    email: zod_1.default.string().min(5, "Email must be at least 5 characters").optional(),
    password: zod_1.default
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^(\+855)?0?\d{8,9}$/, "Invalid phone number")
        .optional(),
    method: zod_1.default.nativeEnum(types_1.LoginMethod, {
        errorMap: () => ({ message: "Invalid login method" }),
    }),
    facebookToken: zod_1.default.string().min(1, "Facebook token is required").optional(),
});
