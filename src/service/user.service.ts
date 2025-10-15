import { PrismaClient } from "@prisma/client";
import { RegisterUserEmail, UpdateUserPayload } from "../types";

export class UserService {
  private prismaClient: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }
  async findAndUpdateFcmToken({
    fcmToken,
    userId,
    platform,
  }: {
    fcmToken: string;
    userId: number;
    platform?: string;
  }) {
    await this.prismaClient.deviceToken.upsert({
      where: { token: fcmToken },
      update: {
        userId,
        platform,
      },
      create: {
        token: fcmToken,
        user: { connect: { id: userId } },
        platform,
      },
    });
  }

  findAll() {
    return this.prismaClient.user.findMany({
      include: {
        profileImages: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      omit: {
        password: true,
      },
    });
  }
  findByNotification(userId: number) {
    return this.prismaClient.notification.findMany({
      where: {
        userId: userId,
      },
    });
  }
  async findUserBadges(userId: number) {
    const userBadges = await this.prismaClient.userBadge.findMany({
      where: { userId },
      include: {
        badge: {
          select: {
            id: true,
            name: true,
            iconUrl: true,
            requiredScore: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return userBadges.map((ub) => ub.badge);
  }

  async findUserExist(email: string) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    return user;
  }
  async findNameById(id: number) {
    const user = await this.prismaClient.user.findFirst({
      where: { id },
      select: {
        name: true,
      },
    });

    return user?.name ?? null;
  }

  async findUserById(id: number) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        id: id,
      },
      include: {
        profileImages: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    return user;
  }
  async deleteById(id: number) {
    return await this.prismaClient.user.delete({
      where: {
        id: id,
      },
    });
  }

  async updateUser(id: number, payload: UpdateUserPayload) {
    // Filter out null, undefined, or empty string fields
    const dataToUpdate = Object.fromEntries(
      Object.entries(payload).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );
    delete dataToUpdate.avatar;
    return await this.prismaClient.user.update({
      where: { id },
      include: {
        profileImages: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      omit: { password: true },
      data: dataToUpdate,
    });
  }

  async registerUserEmail(params: RegisterUserEmail) {
    const user = await this.prismaClient.user.create({
      data: {
        name: params.username,
        email: params.email,
        password: params.password,
        platform: params?.method,
      },
    });

    if (params.avatar) {
      await this.prismaClient.image.create({
        data: {
          url: params.avatar,
          user: {
            connect: { id: user.id },
          },
        },
      });
    }
    return { ...user };
  }
}
