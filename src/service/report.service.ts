import { Prisma, PrismaClient, ReportStatus, ReportType } from "@prisma/client";
import { Reports } from "../types";
import { CreateReportPayload, UpdateReportPayload } from "../types/report";

export class ReportService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create a new report
   */
  async createReport(payload: CreateReportPayload) {
    // Check if image exists
    const existingImage = await this.prisma.image.create({
      data: {
        url: payload.imageUrl,
        userId: payload.userId,
      },
    });

    const data: Prisma.ReportCreateInput = {
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
  async findAllReports(): Promise<Reports[]> {
    return this.prisma.report.findMany({
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

  async findLatestReportByUser({
    userId,
    type,
  }: {
    userId: number;
    type: ReportType;
  }) {
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
        UserBadge: true,
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  /**
   * Find a single report by ID
   */
  async findReportById(id: number): Promise<Reports | null> {
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
  async updateReport(
    id: number,
    payload: UpdateReportPayload
  ): Promise<Reports | null> {
    const data: Prisma.ReportUpdateInput = {
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
      },
    });
  }

  /**
   * Delete a report by ID
   */
  async deleteReport(id: number): Promise<Reports | null> {
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
  async updateReportStatus(id: number, status: ReportStatus): Promise<Reports> {
    return this.prisma.report.update({
      where: { id },
      data: { status },
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
}
