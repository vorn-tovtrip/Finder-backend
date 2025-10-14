import { NextFunction, Request, Response } from "express";
import { CreateReportDTO } from "../dto";
import { PrismaClient } from "../lib";
import {
  createReportSchema,
  updateReportSchema,
  updateStatusReportSchema,
} from "../schema";
import { ReportService, UserService } from "../service";
import { SuccessResponse } from "../utils";
export class ReportController {
  private reportService: ReportService;
  private userService: UserService;

  constructor() {
    this.reportService = new ReportService(PrismaClient);
    this.userService = new UserService(PrismaClient);
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
  updateStatusChatOwner = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const parsed = updateStatusReportSchema.safeParse(req.body);

    // ** Add logic to send notification to the owner that own that report
    // ** User Id here is the one that report
    if (parsed.data && parsed.success) {
      const report = await this.reportService.updateReportStatus(
        id,
        parseInt(parsed.data.userId),
        "CHATOWNER"
      );
      const userIdreport = report.userId;
      console.log(">>> Send notification to ", userIdreport);
      return SuccessResponse({ res, data: report, statusCode: 201 });
    }
  };
  updateStatusConfirm = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const parsed = updateStatusReportSchema.safeParse(req.body);

    // ** User Id here is the one that confirm
    if (parsed.data && parsed.success) {
      const report = await this.reportService.updateReportStatus(
        id,
        parseInt(parsed.data.userId),
        "COMPLETED"
      );
      return SuccessResponse({ res, data: report, statusCode: 201 });
    }
  };
  updateStatusCancel = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const parsed = updateStatusReportSchema.safeParse(req.body);

    // ** Need user id just incase not delete that report
    if (parsed.data && parsed.success) {
      const report = await this.reportService.deleteReport(id);
      return SuccessResponse({ res, data: report, statusCode: 201 });
    }
  };
  deleteReport = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const report = await this.reportService.deleteReport(id);
    return SuccessResponse({
      res,
      data: report,
      statusCode: 201,
    });
  };
}
