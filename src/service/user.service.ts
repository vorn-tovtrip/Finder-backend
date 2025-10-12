import { PrismaClient } from "@prisma/client";
import {
  RegisterPayload,
  RegisterUserEmail,
  UpdateUserPayload,
} from "../types";

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
        images: {
          select: {
            url: true,
          },
        },
      },
      omit: {
        password: true,
      },
    });
  }

  async findUserExist(email: string) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    return user;
  }
  async findUserById(id: number) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        id: id,
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
    return await this.prismaClient.user.update({
      where: {
        id: id,
      },
      data: {
        ...payload,
      },
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
  registerSocialAuth(params: RegisterPayload) {
    const user = this.prismaClient.user.findMany({});
  }
}
