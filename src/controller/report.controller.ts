import { ReportType } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { CreateReportDTO } from "../dto";
import { PrismaClient } from "../lib";
import { ioInstance, onlineUsers } from "../lib/socket/io";
import {
  createReportSchema,
  updateReportSchema,
  updateStatusReportSchema,
} from "../schema";
import { MessageService, ReportService, UserService } from "../service";
import { NotificationService } from "../service/notification.service";
import { SuccessResponse } from "../utils";
import { StorageService } from "../lib/firebase/storage";
export class ReportController {
  private storageService: StorageService;

  private reportService: ReportService;
  private userService: UserService;
  private messageService: MessageService;
  private notificationService: NotificationService;
  constructor() {
    this.storageService = new StorageService();
    this.reportService = new ReportService(PrismaClient);
    this.userService = new UserService(PrismaClient, this.storageService);
    this.messageService = new MessageService(PrismaClient);
    this.notificationService = new NotificationService(PrismaClient);
  }

  getAllReports = async (req: Request, res: Response) => {
    try {
      const filters = req.filters;
      const reports = await this.reportService.findAllReports(filters);
      return SuccessResponse({ res, data: reports, statusCode: 200 });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  getReportById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const report = await this.reportService.findReportById(id);
    return SuccessResponse({ res, data: report, statusCode: 200 });
  };

  createReport = async (
    req: Request,
    res: Response<CreateReportDTO>,
    next: NextFunction
  ) => {
    let imageId;
    const parsed = createReportSchema.safeParse(req.body);

    if (parsed.data) {
      const user = await this.userService.findUserById(parsed.data.userId);
      if (!user) {
        return next("User with the id does not exist");
      }
      const report = await this.reportService.createReport({
        ...parsed.data,
        imageId: imageId,
      } as any);

      return SuccessResponse({ res, data: report, statusCode: 201 });
    }
  };

  updateReport = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const parsed = updateReportSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ message: "Validation error", errors: parsed.error.errors });

    const report = await this.reportService.updateReport(
      id,
      parsed.data! as any
    );
    return SuccessResponse({ res, data: report, statusCode: 201 });
  };

  updateStatusChatOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = Number(req.params.id);
    console.log("Params i", id);
    const parsed = updateStatusReportSchema.safeParse(req.body);

    const reportExist = await this.reportService.findReportById(id);
    if (!reportExist) {
      next("Report does not exist with that id");
    }

    // ** Add logic to send notification to the owner that own that report
    // ** User Id here is the one that report
    // ** Send Notification to the owner report that someone has found your

    if (parsed.data && parsed.success) {
      const username = await this.userService.findNameById(parsed.data.userId);
      const report = await this.reportService.updateReportStatus(
        id,
        parsed.data.userId,
        "CHATOWNER"
      );
      const userIdreport = report.userId;
      const senderId = parsed.data.userId; // user who confirms
      const receiverId = userIdreport; // owner of the report
      const receiverName = reportExist?.user?.name;
      const senderName = username;

      // await this.notificationService.create({
      //   title: "User name",
      //   body: "Someone wants to chat with you to reunite their lost belonging",
      //   userId: report.type == ReportType.FOUND ? userIdreport : id, // Create notification to the user report
      //   description:
      //     "Someone wants to chat with you to reunite their lost belonging",
      // });

      //This will send notification to the user or the report user
      //  title is the sender name

      console.log("Sender name is", senderName, senderId);
      console.log("receiver name is", receiverName, receiverId);

      await this.notificationService.create(
        {
          title: senderName ?? "N/A",

          body:
            reportExist?.type == ReportType.FOUND
              ? "Someone wants to chat with you to reunite their lost belonging"
              : "You received a request message from finder",
          userId: receiverId, // Create notification to the user report
          description: "You received a request message from finder",
        },
        reportExist!.id!
      );

      //  Send to the user it self that click to confirm chat to owner to confirm chat
      //  This case someone claim that they are the owner so both must confirm
      //  title is the receiver name
      await this.notificationService.create(
        {
          title: receiverName ?? "N/A",
          body:
            reportExist?.type == ReportType.LOST
              ? "You received a request message from finder"
              : "You received a request message from finder",
          userId: senderId,
          description: "You received a request message from finder",
        },
        reportExist!.id!
      );

      console.log(">>> Send notification to ", userIdreport);
      // Create empty chat (optional: after confirming, notify/report owner)

      await this.createChatBetweenUser(senderId, receiverId);
      return SuccessResponse({ res, data: report, statusCode: 201 });
    }
  };
  updateStatusConfirm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const parsed = updateStatusReportSchema.safeParse(req.body);

      // Validate report existence
      const reportExist = await this.reportService.findReportById(id);
      if (!reportExist) {
        return next("Report does not exist with that id");
      }

      // Validate request body
      if (!parsed.success) {
        return next("Invalid request body");
      }

      const userId = parsed.data.userId;

      // Determine which user is confirming
      const dataToUpdate: {
        confirmedByPosterId?: number;
        confirmedByClaimerId?: number;
      } = {};

      if (userId === reportExist.userId) {
        // Poster confirms
        dataToUpdate.confirmedByPosterId = userId;
      } else {
        // Claimer confirms
        dataToUpdate.confirmedByClaimerId = userId;
      }

      console.log("Data to update is", dataToUpdate);

      // Update confirmation fields
      const updatedReport = await this.reportService.updateReportConfirm(
        id,
        dataToUpdate
      );

      // If both confirmed → mark report and notifications as COMPLETED
      if (
        updatedReport.confirmedByPosterId &&
        updatedReport.confirmedByClaimerId
      ) {
        // Update report status
        const completedReport = await this.reportService.updateReportStatus(
          id,
          userId,
          "COMPLETED"
        );

        // Get all related notifications
        const notifications = await this.notificationService.findByReportId(
          reportExist.id
        );

        if (notifications?.length) {
          // Find each user’s corresponding notification
          const posterNotification = notifications.find(
            (n) => n.userId === updatedReport.confirmedByPosterId
          );
          const claimerNotification = notifications.find(
            (n) => n.userId === updatedReport.confirmedByClaimerId
          );

          const updates = [];

          if (claimerNotification) {
            updates.push(
              this.notificationService.updateNotificationReport(
                claimerNotification.id,
                {
                  status: "COMPLETED",
                  userId: updatedReport.confirmedByClaimerId,
                }
              )
            );
          }

          if (posterNotification) {
            updates.push(
              this.notificationService.updateNotificationReport(
                posterNotification.id,
                {
                  status: "COMPLETED",
                  userId: updatedReport.confirmedByPosterId,
                }
              )
            );
          }

          await Promise.all(updates);
        }

        // Return completed report
        return SuccessResponse({
          res,
          data: completedReport,
          statusCode: 201,
        });
      }

      return SuccessResponse({
        res,
        data: updatedReport,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error in updateStatusConfirm:", error);
      return next(error);
    }
  };

  updateStatusCancel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = Number(req.params.id);
    const parsed = updateStatusReportSchema.safeParse(req.body);
    const reportExist = await this.reportService.findReportById(id);
    if (!reportExist) {
      next("Report does not exist with that id");
    }

    // ** Need user id just incase not delete that report

    if (parsed.data && parsed.success) {
      const report = await this.reportService.deleteReport(id);
      return SuccessResponse({ res, data: report, statusCode: 201 });
    }
  };
  deleteReport = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const reportExist = await this.reportService.findReportById(id);
    if (!reportExist) {
      next("Report does not exist with that id");
    }
    const report = await this.reportService.deleteReport(id);
    return SuccessResponse({
      res,
      data: report,
      statusCode: 201,
    });
  };
  private async createChatBetweenUser(senderId: number, receiverId: number) {
    try {
      const content = "Hey I have a report related to your item";

      // 1Create message in DB
      const message = await this.messageService.createMessage(
        senderId,
        receiverId,
        content
      );
      console.log(">>> Chat created between", senderId, "and", receiverId);

      // Emit events to receiver if online
      const receiverSocket = onlineUsers[receiverId.toString()];
      if (receiverSocket && ioInstance) {
        // Receiver gets the new message
        ioInstance.to(receiverSocket).emit("receiveMessage", message);
        // notify receiver that a new message was sent
        ioInstance.to(receiverSocket).emit("sendMessage", message);
      }

      // Emit events to sender if online
      const senderSocket = onlineUsers[senderId.toString()];
      if (senderSocket && ioInstance) {
        // Sender also sees their own message
        ioInstance.to(senderSocket).emit("receiveMessage", message);
        // trigger sendMessage event on sender side as well
        ioInstance.to(senderSocket).emit("sendMessage", message);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  }
}
