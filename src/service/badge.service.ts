import { Badge, PrismaClient } from "@prisma/client";
import { CreateBadgeDTO, UpdateBadgeDTO } from "../dto";

export class BadgeService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAllBadges() {
    return this.prisma.badge.findMany({
      omit: {
        description: true,
      },
      orderBy: {
        requiredScore: "asc",
      },
    });
  }

  async findBadgeById(id: number): Promise<Badge | null> {
    return this.prisma.badge.findUnique({ where: { id } });
  }

  async createBadge(data: CreateBadgeDTO): Promise<Badge> {
    return this.prisma.badge.create({ data });
  }

  async updateBadge(id: number, data: UpdateBadgeDTO): Promise<Badge> {
    return this.prisma.badge.update({
      where: { id },
      data,
    });
  }

  async deleteBadge(id: number): Promise<Badge> {
    return this.prisma.badge.delete({ where: { id } });
  }
}
