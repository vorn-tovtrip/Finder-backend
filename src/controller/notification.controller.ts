import { Request, Response } from "express";
import { PrismaClient } from "../lib";
import { NotificationService } from "../service/notification.service";
import { ErrorResponse, SuccessResponse } from "../utils";
import { CreateNotificationDTO } from "../dto/notification.dto";

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

  create = async (req: Request, res: Response<CreateNotificationDTO>) => {
    try {
      const notification = await this.notificationService.create(req.body);
      return SuccessResponse({
        res,
        data: notification,
        statusCode: 201,
      });
    } catch (error) {
      return ErrorResponse({
        res,
        statusCode: 500,
        data: null,
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  update = async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const updated = await this.notificationService.update(id, req.body);
    return SuccessResponse({ res, data: updated, statusCode: 200 });
  };

  delete = async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const deleted = await this.notificationService.delete(id);
    return SuccessResponse({ res, data: deleted, statusCode: 200 });
  };
}
