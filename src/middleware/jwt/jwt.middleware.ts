import { NextFunction, Request, Response } from "express";
import { ErrorResponse, getUserFromRequest } from "../../utils";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await getUserFromRequest(req);
  console.log("user is", user);

  if (!user) {
    return ErrorResponse({
      res,
      data: null,
      statusCode: 401,
      error: "Unauthorized",
    });
  }

  (req as any).user = user;
  next();
};
