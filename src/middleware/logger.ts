import { NextFunction, Request, Response } from "express";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("Request Path Url:", req.path);
  console.log("Request Header:", req.header.name);
  console.log("Host name:", req.hostname);
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};

export default loggerMiddleware;
