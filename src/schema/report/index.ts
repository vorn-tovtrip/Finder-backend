import { ReportType } from "@prisma/client";
import { z } from "zod";

export const createReportSchema = z.object({
  type: z.nativeEnum(ReportType, {
    errorMap: () => ({ message: "Invalid report status" }),
  }),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional(),
  imageUrl: z.string().url().optional(),
  userId: z.number({ invalid_type_error: "userId must be a number" }),
  categoryId: z.number().optional(),
  rewardBadgeId: z.number().optional(),
  contactnumber: z
    .string()
    .regex(/^(\+855)?0?\d{8,9}$/, "Invalid phone number")
    .optional(),
});

export const updateReportSchema = createReportSchema.partial();
