import z from "zod";
import { createReportCategorySchema } from "../schema/category";

export type CreateReportCategoryDTO = z.infer<
  typeof createReportCategorySchema
>;

export type UpdateReportCategoryDTO = Partial<CreateReportCategoryDTO>;
