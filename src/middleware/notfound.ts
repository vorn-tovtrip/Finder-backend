import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

const notFoundMiddleWare = (
  req: Request,
  res: Response<ApiResponse<[]>>,
  next: NextFunction
) => {
  res.status(404).json({
    code: 404,
    data: [],
    message: "Not found",
  });
};
export default notFoundMiddleWare;
