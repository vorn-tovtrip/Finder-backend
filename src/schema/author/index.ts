import { z } from "zod";

export const createAuthorSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 3 char")
    .max(100, "Name must be less then 100 char")
    .trim(),
  email: z
    .string()
    .email("Must be a valid email address")
    .min(3, "Email must be at least 3 char")
    .max(100, "Email must be less then 100 char")
    .trim(),
});
