import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ErrorResponse } from "../utils";

const catchAllErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Catch all error middleware run", err);

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      key: e.path[0],
      message: e.message,
    }));

    return ErrorResponse({
      res,
      data: null,
      error: errors,
      statusCode: 400,
    });
  }

  if (typeof err == "string") {
    return ErrorResponse({
      res,
      data: [],
      error: err,
      statusCode: 400,
    });
  }

  return ErrorResponse({
    res,
    data: null,
    error: err.message || "Something went wrong!!!",
    statusCode: 500,
  });
};
export default catchAllErrorMiddleware;
