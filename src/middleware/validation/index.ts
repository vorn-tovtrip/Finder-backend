import { NextFunction, Request, Response } from "express";
import { CreateBookDTO } from "../../dto";
import { createBookSchema, updateBookSchema } from "../../schema";
import { BookIdParams } from "../../types";

export const createBookValidationMiddleware = (
  req: Request<{}, {}, CreateBookDTO, {}>,
  res: Response,
  next: NextFunction
) => {
  const parsed = createBookSchema.safeParse(req.body);
  if (!parsed.success) {
    next(parsed.error);
    return;
  }
  next();
};
export const updateBookValidate = async (
  req: Request<{}, {}, CreateBookDTO, {}>,
  res: Response,
  next: NextFunction
) => {
  console.log(Object.keys(req.body));
  if (!req.body || !Object.keys(req.body).length) {
    return next("Body params must not be empty");
  }
  const updatedData = updateBookSchema.safeParse(req.body);
  if (!updatedData.success) {
    return next(updatedData.error);
  }
  next();
};

export const checkBookId = async (
  req: Request<BookIdParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const id = +req.params.id;
  console.log("Check book id middleware run", id);
  if (!req.params.id) {
    return next("Book id must not be empty");
  }
  if (isNaN(id)) {
    return next("Book id must be a number");
  }
  next();
};
