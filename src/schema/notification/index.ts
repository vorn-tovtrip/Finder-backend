import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  userId: z.number().int().positive(),
  body: z.string().min(1, "Notification body is required"),
});

export const updateNotificationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  isRead: z.boolean().optional(),
});
