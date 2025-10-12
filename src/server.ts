import compression from "compression";
import session from "express-session";
import express, { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import {
  catchAllErrorMiddleware,
  corsMiddleware,
  loggerMiddleware,
  notFoundMiddleWare,
} from "./middleware";
import mainRoute from "./routes";
const createAppServer = () => {
  const app = express();
  app.use(
    session({
      saveUninitialized: false,
      resave: false,
      secret: "P@ss@123",
      proxy: process.env.NODE_ENV == "production" ? true : false,
      cookie: { secure: process.env.NODE_ENV == "production" ? true : false },
    })
  );
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  app.use(compression());
  app.use(express.json());
  const globalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    message: {
      status: 429,
      message: "Too many requests, please try again later.",
    },
  });

  app.use(loggerMiddleware, corsMiddleware, morgan("dev"));
  app.use(globalRateLimit);
  app.get("/", (_: Request, res: Response) => {
    return res.send(`Welcome to Finder Backend ${process.env.NODE_ENV}`);
  });
  app.use("/api/v1/", mainRoute);
  app.use(notFoundMiddleWare);
  app.use(catchAllErrorMiddleware);
  return app;
};

export default createAppServer;
