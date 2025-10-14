import z from "zod";
import {
  createNotificationSchema,
  updateNotificationSchema,
} from "../schema/notification";

export type CreateNotificationDTO = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationDTO = z.infer<typeof updateNotificationSchema>;
