import { Request, Response } from "express";
import { CreateNotificationDTO } from "../dto/notification.dto";
import { PrismaClient } from "../lib";
import {
  createNotificationSchema,
  testCreateNotificationSchema,
} from "../schema/notification";
import { NotificationService } from "../service/notification.service";
import { ErrorResponse, SuccessResponse } from "../utils";
import { validateSchemaMiddleware } from "../middleware";

export class NotificationController {
  private readonly notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService(PrismaClient);
  }

  getAll = async (_: Request, res: Response) => {
    const notifications = await this.notificationService.findAll();
    return SuccessResponse({ res, data: notifications, statusCode: 200 });
  };

  getById = async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const notification = await this.notificationService.findById(id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    return SuccessResponse({ res, data: notification, statusCode: 200 });
  };

  getByUser = async (req: Request<{ userId: string }>, res: Response) => {
    const userId = parseInt(req.params.userId);
    const notifications = await this.notificationService.findByUserId(userId);
    return SuccessResponse({ res, data: notifications, statusCode: 200 });
  };

  sendTestUser = async (req: Request<{ userId: string }>, res: Response) => {
    const parse = testCreateNotificationSchema.safeParse(req.body);

    console.log("Run");

    if (parse.data) {
      // Here send notificaiton to user
    }

    return SuccessResponse({ res, data: parse.data, statusCode: 200 });
  };

  create = async (req: Request, res: Response<CreateNotificationDTO>) => {
    try {
      const parseData = await createNotificationSchema.safeParse(req.body);
      if (parseData.data) {
        const notification = await this.notificationService.create(
          {
            ...parseData.data,
            status: "PENDING",
            userId: parseData.data.userId,
          },
          parseInt(parseData.data.reportId!)
        );
        return SuccessResponse({
          res,
          data: notification,
          statusCode: 201,
        });
      }
    } catch (error) {
      return ErrorResponse({
        res,
        statusCode: 500,
        data: null,
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const deleted = await this.notificationService.delete(id);
    return SuccessResponse({ res, data: deleted, statusCode: 200 });
  };
}
