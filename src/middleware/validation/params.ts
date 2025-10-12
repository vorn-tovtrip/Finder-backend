import { NextFunction, Request, Response } from "express";
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
