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
import { SuccessResponse } from "../utils";
export class ReportController {
  private reportService: ReportService;
  private userService: UserService;
  private messageService: MessageService;

  constructor() {
    this.reportService = new ReportService(PrismaClient);
    this.userService = new UserService(PrismaClient);
    this.messageService = new MessageService(PrismaClient);
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
      const report = await this.reportService.updateReportStatus(
        id,
        parsed.data.userId,
        "CHATOWNER"
      );
      const userIdreport = report.userId;
      console.log(">>> Send notification to ", userIdreport);
      // Create empty chat (optional: after confirming, notify/report owner)
      const senderId = parsed.data.userId; // user who confirms
      const receiverId = userIdreport; // owner of the report
      await this.createChatBetweenUser(senderId, receiverId);
      return SuccessResponse({ res, data: report, statusCode: 201 });
    }
  };
  updateStatusConfirm = async (
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
    // ** User Id here is the one that confirm
    // ** Send Notification to the user that you success earn a badge
    if (parsed.data && parsed.success) {
      const report = await this.reportService.updateReportStatus(
        id,
        parsed.data.userId,
        "COMPLETED"
      );

      return SuccessResponse({ res, data: report, statusCode: 201 });
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
