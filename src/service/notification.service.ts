import { Notification, NotificationStatus, PrismaClient } from "@prisma/client";
import admin from "firebase-admin";
import { BatchResponse } from "firebase-admin/lib/messaging/messaging-api";
import {
  CreateNotificationDTO,
  UpdateNotificationDTO,
} from "../dto/notification.dto";
export class NotificationService {
  constructor(private readonly prisma: PrismaClient) {}
  async sendNotificationToUser(
    tokens: string[],
    payload: { title: string; body: string }
  ): Promise<string | BatchResponse> {
    if (tokens.length === 0) return Promise.resolve(""); //Case no FCM token register
    if (tokens.length === 1) {
      return admin.messaging().send({
        token: tokens[0],
        notification: payload,
      });
    } else {
      return admin.messaging().sendEachForMulticast({
        tokens,
        notification: payload,
      });
    }
  }
  async findByReportId(reportId: number) {
    return await this.prisma.notification.findMany({
      where: {
        reportId,
      },
    });
  }
  async create(
    data: CreateNotificationDTO,
    reportId: number
  ): Promise<Notification> {
    const notification = await this.prisma.notification.create({
      data: {
        description: data.body,
        title: data.title,
        isRead: false,
        reportId: reportId,
        userId: data.userId,
        status: "PENDING",
      },
    });
    const tokens = await this.prisma.deviceToken.findMany({
      where: { userId: data.userId },
      select: { token: true },
    });

    const tokenList = tokens.map((t) => t.token).filter(Boolean);

    if (tokenList.length > 0) {
      try {
        const payload = {
          title: notification.title ?? "New Notification",
          body: data.body ?? "You have a new update.",
        };

        const response = await this.sendNotificationToUser(tokenList, payload);

        // Handle different response types
        if (typeof response === "string") {
          console.log("Notification sent, messageId:", response);
        } else {
          // BatchResponse from sendEachForMulticast
          console.log(
            `Notification sent: ${response.successCount} successes, ${response.failureCount} failures`
          );
          response.responses.forEach((r, idx) => {
            if (!r.success) {
              console.warn(
                `Failed token: ${tokenList[idx]} ->`,
                r.error?.message
              );
            }
          });
        }
      } catch (error) {
        console.error("Failed to send notification:", error);
        throw error;
      }
    }

    return notification;
  }
  async findAll(): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateNotificationReport(id: number, data: UpdateNotificationDTO) {
    // Update the notification

    const updatedNotification = await this.prisma.notification.update({
      where: { id },
      data: {
        status: data.status as NotificationStatus,
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });

    return updatedNotification;
  }

  async findById(id: number): Promise<Notification | null> {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },

      include: {
        user: {
          omit: {
            password: true,
          },
        },
      },
    });
  }

  // async update(id: number, data: UpdateNotificationDTO): Promise<Notification> {
  //   return this.prisma.notification.update({
  //     where: { id },
  //     data,
  //   });
  // }

  async delete(id: number): Promise<Notification> {
    return this.prisma.notification.delete({ where: { id } });
  }
}
