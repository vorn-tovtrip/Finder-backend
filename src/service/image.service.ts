import { PrismaClient } from "@prisma/client";

export class UploadService {
  private prismaClient: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async deleteById(id: number) {
    return await this.prismaClient.image.delete({
      where: {
        id: id,
      },
    });
  }
}
