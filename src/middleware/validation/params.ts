import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { getAllReportsQuerySchema } from "../../schema";
export const checkParamsId = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const id = +req.params.id;
  console.log("Middleware params chekc", id);
  if (!req.params.id) {
    return next("Params id must not be empty");
  }
  if (isNaN(id)) {
    return next("Params id must be a number");
  }
  next();
};

export const validateReportQueryMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const query = getAllReportsQuerySchema.parse(req.query);

    const filters: Prisma.ReportWhereInput = {};

    if (query.categoryId) filters.categoryId = query.categoryId;
    if (query.type) filters.type = query.type;
    if (query.search) {
      filters.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.status) filters.status = query.status;

    req.filters = filters;
    next();
  } catch (error) {
    next(error);
  }
};
