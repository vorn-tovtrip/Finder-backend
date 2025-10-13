import z from "zod";
import { authenticationSchema, loginSchema, updateUserSchema } from "../schema";
export type RegisterUserDTO = z.infer<typeof authenticationSchema>;

export type LoginUserDTO = z.infer<typeof loginSchema>;

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
