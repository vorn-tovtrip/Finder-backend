import { socialAuthSchema } from "../login";
export const updateUserSchema = socialAuthSchema.partial();
