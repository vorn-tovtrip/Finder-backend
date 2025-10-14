"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportCategorySchema = void 0;
const zod_1 = require("zod");
exports.createReportCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Category name is required"),
});
