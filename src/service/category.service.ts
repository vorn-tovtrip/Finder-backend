import { PrismaClient, ReportCategory } from "@prisma/client";

export class ReportCategoryService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(): Promise<ReportCategory[]> {
    return this.prisma.reportCategory.findMany({});
  }

  async findById(id: number): Promise<ReportCategory | null> {
    return this.prisma.reportCategory.findUnique({
      where: { id },
      include: { reports: true },
    });
  }

  async create(name: string): Promise<ReportCategory> {
    return this.prisma.reportCategory.create({
      data: { name },
    });
  }

  async update(id: number, name: string): Promise<ReportCategory> {
    return this.prisma.reportCategory.update({
      where: { id },
      data: { name },
    });
  }

  async delete(id: number): Promise<ReportCategory> {
    return this.prisma.reportCategory.delete({
      where: { id },
    });
  }
}
