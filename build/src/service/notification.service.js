"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
class NotificationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.notification.create({ data });
    }
    async findAll() {
        return this.prisma.notification.findMany({
            include: { user: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: "desc" },
        });
    }
    async findById(id) {
        return this.prisma.notification.findUnique({ where: { id } });
    }
    async findByUserId(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
    async update(id, data) {
        return this.prisma.notification.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return this.prisma.notification.delete({ where: { id } });
    }
}
exports.NotificationService = NotificationService;
