import z from "zod";
import { createBadgeSchema, updateBadgeSchema } from "../schema/badge";

export type CreateBadgeDTO = z.infer<typeof createBadgeSchema>;
export type UpdateBadgeDTO = z.infer<typeof updateBadgeSchema>;
