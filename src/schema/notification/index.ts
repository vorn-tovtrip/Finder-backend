import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  userId: z.number().int().positive(),
  body: z.string().min(1, "Notification body is required"),
  status: z.string().nullable().optional(),
  reportId: z.string().optional(),
});

export const updateNotificationSchema = createNotificationSchema.partial();

export const testCreateNotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fcmToken: z.string().min(1, "Fcm token is required"),
  body: z.string().min(1, "Notification body is required"),
});
