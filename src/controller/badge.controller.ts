// src/controller/badge.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "../lib";
import { BadgeService } from "../service/badge.service";
import { ErrorResponse, SuccessResponse } from "../utils";
import { UploadService } from "../service";

export class BadgeController {
  private readonly badgeService: BadgeService;

  constructor() {
    this.badgeService = new BadgeService(PrismaClient);
  }

  getAll = async (_: Request, res: Response) => {
    const badges = await this.badgeService.findAllBadges();
    return SuccessResponse({ res, data: badges, statusCode: 200 });
  };

  getById = async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const badge = await this.badgeService.findBadgeById(id);
    if (!badge)
      return ErrorResponse({
        res,
        data: "Badge is not found",
        statusCode: 400,
      });
    return SuccessResponse({ res, data: badge, statusCode: 200 });
  };

  create = async (req: Request, res: Response) => {
    const badge = await this.badgeService.createBadge(req.body);

    return SuccessResponse({ res, data: badge, statusCode: 201 });
  };

  update = async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const badge = await this.badgeService.updateBadge(id, req.body);
    return SuccessResponse({ res, data: badge, statusCode: 200 });
  };

  delete = async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const badge = await this.badgeService.deleteBadge(id);
    return SuccessResponse({ res, data: badge, statusCode: 200 });
  };
}
