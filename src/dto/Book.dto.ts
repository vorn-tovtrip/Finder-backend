import { z } from "zod";
import { createBookSchema, updateBookSchema } from "../schema";

export type CreateBookDTO = z.infer<typeof createBookSchema>;
export type UpdateBookDTO = z.infer<typeof updateBookSchema>;
