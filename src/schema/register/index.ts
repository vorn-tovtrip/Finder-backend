import z from "zod";
import { LoginMethod } from "../../types";

export const authenticationSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  email: z.string().min(5, "Email must be at least 5 characters").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Invalid phone number")
    .optional(),
  method: z.nativeEnum(LoginMethod, {
    errorMap: () => ({ message: "Invalid login method" }),
  }),
  facebookToken: z.string().min(1, "Facebook token is required").optional(),
});
