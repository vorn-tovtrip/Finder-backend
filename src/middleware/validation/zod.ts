import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export const validateSchemaMiddleware =
  <T extends ZodTypeAny>(schema: T) =>
  (req: Request, _: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      // Send validation errors or pass to error handler
      return next(parsed.error);
    }
    // Replace req.body with the validated data
    req.body = parsed.data;
    next();
  };
