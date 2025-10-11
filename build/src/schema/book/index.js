"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookSchema = exports.createBookSchema = void 0;
const zod_1 = require("zod");
// Zod schema for creating a book
exports.createBookSchema = zod_1.z.object({
    bookName: zod_1.z
        .string()
        .nonempty("Book name cannot be empty")
        .min(3, "Book must be at least 3 characters")
        .max(50, "Book must be at most 50 characters")
        .trim(),
    code: zod_1.z
        .string()
        .nonempty("Code name cannot be empty")
        .min(3, "Code must be at least 3 characters")
        .max(50, "Code must be at most 50 characters")
        .trim(),
    authors: zod_1.z
        .array(zod_1.z.number().nonnegative())
        .nonempty("At least one author is required"),
});
exports.updateBookSchema = zod_1.z.object({
    bookName: zod_1.z
        .string()
        .nonempty("Book name cannot be empty")
        .min(3, "Book must be at least 3 characters")
        .max(50, "Book must be at most 50 characters")
        .trim()
        .optional(),
    code: zod_1.z
        .string()
        .nonempty("Code name cannot be empty")
        .min(3, "Code must be at least 3 characters")
        .max(50, "Code must be at most 50 characters")
        .trim()
        .optional(),
});
