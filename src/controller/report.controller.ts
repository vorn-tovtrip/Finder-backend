import { NextFunction, Request, Response } from "express";
import { CreateReportDTO } from "../dto";
import { PrismaClient } from "../lib";
import { createReportSchema, updateReportSchema } from "../schema";
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
    const reports = await this.reportService.findAllReports();
    return SuccessResponse({ res, data: reports, statusCode: 200 });
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
