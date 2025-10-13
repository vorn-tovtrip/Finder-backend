import z from "zod";
import { LoginMethod } from "../../types";

export const loginSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  avatar: z.string().url().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  method: z.nativeEnum(LoginMethod, {
    errorMap: () => ({ message: "Invalid login method" }),
  }),
});

export const socialAuthSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  avatar: z.string().url().optional(),
  method: z.nativeEnum(LoginMethod, {
    errorMap: () => ({ message: "Invalid login method" }),
  }),
  socialToken: z.string(),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Invalid phone number")
    .optional(),
});
