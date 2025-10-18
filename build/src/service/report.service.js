"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const client_1 = require("@prisma/client");
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
                Notification: { select: { id: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async findLatestReportByUser({ userId, type, }) {
        console.log(type);
        return this.prisma.report.findFirst({
            where: {
                userId,
                // AND: {
                //   type: type,
                // },
            },
            omit: {
                categoryId: true,
                rewardBadgeId: true,
            },
            include: {
                rewardBadge: true,
                category: true,
                userBadge: true,
            },
            orderBy: {
                id: "desc",
            },
        });
    }
    async updateReportConfirm(reportId, data) {
        const updatedReport = await this.prisma.report.update({
            where: { id: reportId },
            data,
        });
        return updatedReport;
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
                Notification: { select: { id: true } },
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
                Notification: { select: { id: true } },
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
                Notification: { select: { id: true } },
            },
        });
    }
    async addScoreAndCheckBadge(userId, incrementBy = 1) {
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { totalScore: { increment: incrementBy } },
            select: { id: true, totalScore: true },
        });
        // find eligible badges
        const eligibleBadges = await this.prisma.badge.findMany({
            where: { requiredScore: { lte: updatedUser.totalScore } },
        });
        // find owned badges
        const ownedBadges = await this.prisma.userBadge.findMany({
            where: { userId },
            select: { badgeId: true },
        });
        const ownedIds = ownedBadges.map((b) => b.badgeId);
        // add missing badges
        const newBadges = eligibleBadges.filter((b) => !ownedIds.includes(b.id));
        if (newBadges.length > 0) {
            await this.prisma.userBadge.createMany({
                data: newBadges.map((b) => ({
                    userId,
                    badgeId: b.id,
                })),
                skipDuplicates: true,
            });
        }
        return updatedUser;
    }
    /**
     * Update only report status
     */
    async updateReportStatus(id, userId, status) {
        const report = await this.prisma.report.update({
            where: {
                id: id,
            },
            data: { status },
        });
        console.log(userId);
        //*** **** Update user score here **** ****
        if (status != "CHATOWNER") {
            const userIdReward = report.type == client_1.ReportType.FOUND
                ? report.userId
                : report.confirmedByClaimerId;
            await this.addScoreAndCheckBadge(userIdReward, 1);
        }
        return report;
    }
}
exports.ReportService = ReportService;
