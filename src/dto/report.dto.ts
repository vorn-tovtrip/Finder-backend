import { z } from "zod";
import { createReportSchema, updateReportSchema } from "../schema";

export type CreateReportDTO = z.infer<typeof createReportSchema>;

export type UpdateReportDTO = z.infer<typeof updateReportSchema>;
