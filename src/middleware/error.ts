import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const catchAllErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Catch all error middleware run", err);

  if (err instanceof ZodError) {
    const errorMessage = err.errors.map((e) => e.path + " " + e.message);
    res.status(400).json({
      message: errorMessage,
      code: 400,
      data: null,
    });
    return;
  }

  if (typeof err == "string") {
    res.status(400).json({
      message: err,
      code: 400,
      data: null,
    });
    return;
  }
  res.status(500).json({
    message: err.message || "Something went wrong!!!",
    code: 500,
    data: null,
  });
};
export default catchAllErrorMiddleware;
