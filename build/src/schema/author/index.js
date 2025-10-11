"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthorSchema = void 0;
const zod_1 = require("zod");
exports.createAuthorSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 3 char")
        .max(100, "Name must be less then 100 char")
        .trim(),
    email: zod_1.z
        .string()
        .email("Must be a valid email address")
        .min(3, "Email must be at least 3 char")
        .max(100, "Email must be less then 100 char")
        .trim(),
});
