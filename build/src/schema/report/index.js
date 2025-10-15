"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusReportSchema = exports.updateReportSchema = exports.createReportSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createReportSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(client_1.ReportType, {
        errorMap: () => ({ message: "Invalid report status" }),
    }),
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    location: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url().optional(),
    userId: zod_1.z.number({ invalid_type_error: "userId must be a number" }),
    categoryId: zod_1.z.number().optional(),
    timeLostAt: zod_1.z.preprocess((val) => {
        if (typeof val === "string" || typeof val === "number") {
            const date = new Date(val);
            return isNaN(date.getTime()) ? undefined : date;
        }
        return val;
    }, zod_1.z.date({
        required_error: "timeLostAt is required",
        invalid_type_error: "Invalid date/time provided",
    })),
    rewardBadgeId: zod_1.z.number().optional(),
    contactnumber: zod_1.z
        .string()
        .regex(/^(\+855)?0?\d{8,9}$/, "Invalid phone number")
        .optional(),
});
exports.updateReportSchema = exports.createReportSchema.partial();
exports.updateStatusReportSchema = zod_1.z.object({
    userId: zod_1.z.number().min(1, "User Id is required"),
});
