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

  async findByUrl(url: string) {
    const img = await this.prismaClient.image.findFirst({
      where: {
        url: url,
      },
    });

    return img?.url;
  }
  async updateById(id: number, newUrl: string) {
    return await this.prismaClient.image.update({
      where: {
        id: id,
      },
      data: {
        url: newUrl,
      },
    });
  }
}
