"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.socialAuthSchema = exports.loginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const types_1 = require("../../types");
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    username: zod_1.default
        .string()
        .min(3, "Username must be at least 3 characters")
        .optional(),
    avatar: zod_1.default.string().url().optional(),
    password: zod_1.default
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional(),
    method: zod_1.default.nativeEnum(types_1.LoginMethod, {
        errorMap: () => ({ message: "Invalid login method" }),
    }),
});
exports.socialAuthSchema = zod_1.default.object({
    email: zod_1.default
        .string()
        .email({ message: "Must be a valid email address" })
        .optional(),
    username: zod_1.default
        .string()
        .min(3, "Username must be at least 3 characters")
        .optional(),
    avatar: zod_1.default.string().url().optional(),
    method: zod_1.default.nativeEnum(types_1.LoginMethod, {
        errorMap: () => ({ message: "Invalid login method" }),
    }),
    socialToken: zod_1.default.string().min(1, "Social token is required"),
    phone: zod_1.default
        .string()
        .regex(/^\+?\d{10,15}$/, "Invalid phone number")
        .optional(),
});
exports.updateProfileSchema = zod_1.default.object({
    email: zod_1.default
        .string()
        .email({ message: "Must be a valid email address" })
        .optional()
        .nullable(),
    username: zod_1.default
        .string()
        .min(3, "Username must be at least 3 characters")
        .nullable()
        .optional(),
    avatar: zod_1.default.string().nullable().optional(),
    password: zod_1.default
        .string()
        .min(6, "Password must be at least 6 characters")
        .nullable()
        .optional(),
    address: zod_1.default.string().nullable().optional(),
    phone: zod_1.default
        .string()
        .regex(/^\+?\d{10,15}$/, "Invalid phone number")
        .nullable(),
});
