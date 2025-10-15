"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeService = void 0;
class BadgeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllBadges() {
        return this.prisma.badge.findMany({
            omit: {
                description: true,
            },
        });
    }
    async findBadgeById(id) {
        return this.prisma.badge.findUnique({ where: { id } });
    }
    async createBadge(data) {
        return this.prisma.badge.create({ data });
    }
    async updateBadge(id, data) {
        return this.prisma.badge.update({
            where: { id },
            data,
        });
    }
    async deleteBadge(id) {
        return this.prisma.badge.delete({ where: { id } });
    }
}
exports.BadgeService = BadgeService;
