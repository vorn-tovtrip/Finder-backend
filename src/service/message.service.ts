import { Message, PrismaClient } from "@prisma/client";

export class MessageService {
  private prismaClient: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async createMessage(
    senderId: number,
    receiverId: number,
    content: string
  ): Promise<Message> {
    return this.prismaClient.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
  }

  async getConversations(userId: number) {
    // Group messages by the other user and get the last message
    const messages = await this.prismaClient.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
    });

    const convMap: Record<number, any> = {};

    messages.forEach((msg) => {
      const otherUserId =
        msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!convMap[otherUserId]) {
        convMap[otherUserId] = {
          userId: otherUserId,
          lastMessage: msg.content,
          lastUpdatedAt: msg.createdAt,
        };
      }
    });

    return Object.values(convMap);
  }

  async findAll() {
    return this.prismaClient.message.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async getMessagesBetween(user1: number, user2: number): Promise<Message[]> {
    return this.prismaClient.message.findMany({
      where: {
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
  }
}
