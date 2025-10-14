"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBadgeSchema = exports.createBadgeSchema = void 0;
const zod_1 = require("zod");
exports.createBadgeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Badge name is required"),
    description: zod_1.z.string().optional(),
    iconUrl: zod_1.z.string().url("Invalid icon URL").optional(),
    requiredScore: zod_1.z
        .number({
        required_error: "Required score is required",
        invalid_type_error: "Required score must be a number",
    })
        .int("Score must be an integer")
        .min(0, "Required score must be 0 or greater"),
});
exports.updateBadgeSchema = exports.createBadgeSchema.partial();
