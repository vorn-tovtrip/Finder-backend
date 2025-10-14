"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReportsQuerySchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.getAllReportsQuerySchema = zod_1.default.object({
    categoryId: zod_1.default
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : undefined)),
    type: zod_1.default.enum(["FOUND", "LOST"]).optional(),
    search: zod_1.default.string().optional(),
    status: zod_1.default
        .nativeEnum(client_1.ReportStatus, {
        errorMap: () => ({
            message: "Invalid report status must be  | PENDING | CHATOWNER | COMPLETED",
        }),
    })
        .optional(),
});
