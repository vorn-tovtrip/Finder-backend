import { PrismaClient } from "@prisma/client";

export class MessageService {
  private prismaClient: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async createMessage(senderId: number, receiverId: number, content: string) {
    return this.prismaClient.message.create({
      omit: {
        userId: true,
      },
      data: {
        senderId,
        receiverId,
        content,
      },
    });
  }
  async deleteAll() {
    await this.prismaClient.message.deleteMany({});
  }
  async getConversations(userId: number) {
    const messages = await this.prismaClient.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImages: {
              select: { url: true },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImages: {
              select: { url: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const convMap: Record<number, any> = {};

    messages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const otherUser = isSender ? msg.receiver : msg.sender;

      if (!convMap[otherUser.id]) {
        convMap[otherUser.id] = {
          userId: otherUser.id,
          name: otherUser.name,
          email: otherUser.email,
          profileImage: otherUser.profileImages?.[0]?.url || null,
          lastMessage: msg.content,
          lastUpdatedAt: msg.createdAt,
        };
      }
    });

    return Object.values(convMap);
  }

  async findAll() {
    return this.prismaClient.message.findMany({
      omit: {
        userId: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async getMessagesBetween(user1: number, user2: number) {
    return this.prismaClient.message.findMany({
      omit: {
        userId: true,
      },
      where: {
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        receiver: {
          omit: { password: true },
        },
        sender: {
          omit: { password: true },
        },
      },
    });
  }
}
