import { z } from "zod";

// Zod schema for creating a book
export const createBookSchema = z.object({
  bookName: z
    .string()
    .nonempty("Book name cannot be empty")
    .min(3, "Book must be at least 3 characters")
    .max(50, "Book must be at most 50 characters")
    .trim(),
  code: z
    .string()
    .nonempty("Code name cannot be empty")
    .min(3, "Code must be at least 3 characters")
    .max(50, "Code must be at most 50 characters")
    .trim(),

  authors: z
    .array(z.number().nonnegative())
    .nonempty("At least one author is required"),
});

export const updateBookSchema = z.object({
  bookName: z
    .string()
    .nonempty("Book name cannot be empty")
    .min(3, "Book must be at least 3 characters")
    .max(50, "Book must be at most 50 characters")
    .trim()
    .optional(),

  code: z
    .string()
    .nonempty("Code name cannot be empty")
    .min(3, "Code must be at least 3 characters")
    .max(50, "Code must be at most 50 characters")
    .trim()
    .optional(),
});
