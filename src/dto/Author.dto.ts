import { z } from "zod";
import { createAuthorSchema } from "../schema/author";
export type CreateAuthorDto = z.infer<typeof createAuthorSchema>;
