"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCreateNotificationSchema = exports.updateNotificationSchema = exports.createNotificationSchema = void 0;
const zod_1 = require("zod");
exports.createNotificationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    userId: zod_1.z.number().int().positive(),
    body: zod_1.z.string().min(1, "Notification body is required"),
    status: zod_1.z.string().nullable().optional(),
    reportId: zod_1.z.string().optional(),
});
exports.updateNotificationSchema = exports.createNotificationSchema.partial();
exports.testCreateNotificationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    fcmToken: zod_1.z.string().min(1, "Fcm token is required"),
    body: zod_1.z.string().min(1, "Notification body is required"),
});
