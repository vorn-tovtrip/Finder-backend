import { z } from "zod";

export const createReportCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});
