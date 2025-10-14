import { Notification, PrismaClient } from "@prisma/client";
import {
  CreateNotificationDTO,
  UpdateNotificationDTO,
} from "../dto/notification.dto";
export class NotificationService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateNotificationDTO): Promise<Notification> {
    return this.prisma.notification.create({ data });
  }

  async findAll(): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: number): Promise<Notification | null> {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: number, data: UpdateNotificationDTO): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Notification> {
    return this.prisma.notification.delete({ where: { id } });
  }
}
