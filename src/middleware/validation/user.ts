import { NextFunction, Request, Response } from "express";
import {
  authenticationSchema,
  loginSchema,
  socialAuthSchema,
} from "../../schema";

export const registerSchemaValidation = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const parsed = authenticationSchema.safeParse(req.body);
  if (!parsed.success) {
    // Return validation errors
    return next(parsed.error);
  }
  req.body = parsed.data;
  next();
};

export const loginSchemaValidation = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    // Return validation errors
    return next(parsed.error);
  }
  req.body = parsed.data;
  next();
};

export const socialAuthValidation = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const parsed = socialAuthSchema.safeParse(req.body);
  if (!parsed.success) {
    // Return validation errors
    return next(parsed.error);
  }
  req.body = parsed.data;
  next();
};
