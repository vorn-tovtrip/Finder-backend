import { Request, Response } from "express";
import { PrismaClient } from "../lib";
import { ReportCategoryService } from "../service";
import { SuccessResponse } from "../utils";

export class ReportCategoryController {
  private reportCategoryService: ReportCategoryService;

  constructor() {
    this.reportCategoryService = new ReportCategoryService(PrismaClient);
  }

  getAll = async (_: Request, res: Response) => {
    const categories = await this.reportCategoryService.findAll();
    return SuccessResponse({ res, data: categories, statusCode: 200 });
  };

  getById = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const category = await this.reportCategoryService.findById(Number(id));
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    return SuccessResponse({ res, data: category, statusCode: 200 });
  };

  create = async (req: Request, res: Response) => {
    const { name } = req.body;
    const category = await this.reportCategoryService.create(name);
    return SuccessResponse({ res, data: category, statusCode: 201 });
  };

  update = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await this.reportCategoryService.update(Number(id), name);
    return SuccessResponse({ res, data: category, statusCode: 200 });
  };

  delete = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const category = await this.reportCategoryService.delete(Number(id));
    return SuccessResponse({ res, data: category, statusCode: 200 });
  };
}
