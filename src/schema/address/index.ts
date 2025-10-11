import { z } from "zod";

export const createAddressSchema = z.object({
  city: z
    .string()
    .min(3, "City must be at least 3 char")
    .max(100, "City must be less then 100 char")
    .trim(),
  country: z
    .string()
    .min(3, "Country must be at least 3 char")
    .max(100, "Country must be less then 100 char")
    .trim(),
});
