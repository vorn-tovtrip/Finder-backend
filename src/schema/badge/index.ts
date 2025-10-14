import { z } from "zod";

export const createBadgeSchema = z.object({
  name: z.string().min(1, "Badge name is required"),
  description: z.string().optional(),
  iconUrl: z.string().url("Invalid icon URL").optional(),
  requiredScore: z
    .number({
      required_error: "Required score is required",
      invalid_type_error: "Required score must be a number",
    })
    .int("Score must be an integer")
    .min(0, "Required score must be 0 or greater"),
});

export const updateBadgeSchema = createBadgeSchema.partial();
