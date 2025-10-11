"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddressSchema = void 0;
const zod_1 = require("zod");
exports.createAddressSchema = zod_1.z.object({
    city: zod_1.z
        .string()
        .min(3, "City must be at least 3 char")
        .max(100, "City must be less then 100 char")
        .trim(),
    country: zod_1.z
        .string()
        .min(3, "Country must be at least 3 char")
        .max(100, "Country must be less then 100 char")
        .trim(),
});
