import { ReportStatus } from "@prisma/client";
import z from "zod";

export const getAllReportsQuerySchema = z.object({
  categoryId: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  type: z.enum(["FOUND", "LOST"]).optional(),
  search: z.string().optional(),
  status: z
    .nativeEnum(ReportStatus, {
      errorMap: () => ({
        message:
          "Invalid report status must be  | PENDING | CHATOWNER | COMPLETED",
      }),
    })
    .optional(),
});
