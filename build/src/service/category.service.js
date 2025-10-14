"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCategoryService = void 0;
class ReportCategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.reportCategory.findMany({});
    }
    async findById(id) {
        return this.prisma.reportCategory.findUnique({
            where: { id },
            include: { reports: true },
        });
    }
    async create(name) {
        return this.prisma.reportCategory.create({
            data: { name },
        });
    }
    async update(id, name) {
        return this.prisma.reportCategory.update({
            where: { id },
            data: { name },
        });
    }
    async delete(id) {
        return this.prisma.reportCategory.delete({
            where: { id },
        });
    }
}
exports.ReportCategoryService = ReportCategoryService;
