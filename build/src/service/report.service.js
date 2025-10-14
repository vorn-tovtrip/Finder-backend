"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
class ReportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Create a new report
     */
    async createReport(payload) {
        // Check if image exists
        const existingImage = await this.prisma.image.create({
            data: {
                url: payload.imageUrl,
                userId: payload.userId,
            },
        });
        const data = {
            type: payload.type,
            title: payload.title,
            description: payload.description,
            location: payload.location ?? null,
            timeLostAt: payload.timeLostAt ?? null,
            user: {
                connect: { id: payload.userId },
            },
            contactnumber: payload.contactnumber,
            ...(payload.categoryId && {
                category: { connect: { id: payload.categoryId } },
            }),
            //  Check only connect image if it exists
            ...(existingImage && {
                images: { connect: [{ id: existingImage.id }] },
            }),
            ...(payload.rewardBadgeId && {
                rewardBadge: { connect: { id: payload.rewardBadgeId } },
            }),
        };
        // Create the report
        const report = await this.prisma.report.create({
            data,
            include: { images: true, category: true, rewardBadge: true },
        });
        return report;
    }
    /**
     * Get all reports with optional related data
     */
    async findAllReports(filters) {
        console.log("Filter is ", filters);
        return this.prisma.report.findMany({
            where: filters,
            omit: {
                categoryId: true,
                rewardBadgeId: true,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                images: { select: { url: true } },
                category: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async findLatestReportByUser({ userId, type, }) {
        return this.prisma.report.findFirst({
            where: {
                userId,
                AND: {
                    type: type,
                },
            },
            omit: {
                categoryId: true,
                rewardBadgeId: true,
            },
            include: {
                rewardBadge: true,
                category: true,
                claims: true,
                histories: true,
                userBadge: true,
            },
            orderBy: {
                id: "desc",
            },
        });
    }
    async findReportHistoryByUser({ userId, status, }) {
        return this.prisma.report.findMany({
            where: {
                userId,
                ...(status && { status: { equals: status } }),
            },
            omit: {
                categoryId: true,
                rewardBadgeId: true,
            },
            include: {
                rewardBadge: true,
                category: true,
                claims: true,
                histories: true,
                userBadge: true,
            },
            orderBy: {
                id: "desc",
            },
        });
    }
    /**
     * Find a single report by ID
     */
    async findReportById(id) {
        return this.prisma.report.findUnique({
            where: { id },
            omit: {
                categoryId: true,
                rewardBadgeId: true,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                images: { select: { url: true } },
                category: { select: { id: true, name: true } },
            },
        });
    }
    /**
     * Update a report by ID
     */
    async updateReport(id, payload) {
        const data = {
            ...(payload.type && { type: payload.type }),
            ...(payload.title && { title: payload.title }),
            ...(payload.timeLostAt && { timeLostAt: payload.timeLostAt }),
            ...(payload.description && { description: payload.description }),
            ...(payload.location && { location: payload.location }),
            ...(payload.imageUrl && { imageUrl: payload.imageUrl }),
            ...(payload.contactnumber && { contactnumber: payload.contactnumber }),
            ...(payload.categoryId && {
                category: { connect: { id: payload.categoryId } },
            }),
            ...(payload.rewardBadgeId && {
                rewardBadge: { connect: { id: payload.rewardBadgeId } },
            }),
        };
        return this.prisma.report.update({
            where: { id },
            data,
            omit: {
                categoryId: true,
                rewardBadgeId: true,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                images: { select: { url: true } },
                category: { select: { id: true, name: true } },
            },
        });
    }
    /**
     * Delete a report by ID
     */
    async deleteReport(id) {
        return this.prisma.report.delete({
            where: { id },
            omit: {
                categoryId: true,
                rewardBadgeId: true,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                images: { select: { url: true } },
                category: { select: { id: true, name: true } },
            },
        });
    }
    /**
     * Update only report status
     */
    async updateReportStatus(id, userId, status) {
        return this.prisma.report.update({
            where: {
                userId: userId,
                id,
            },
            data: { status },
        });
    }
}
exports.ReportService = ReportService;
