import corsMiddleware from "./cors";
import catchAllErrorMiddleware from "./error";
import { authMiddleware } from "./jwt/jwt.middleware";
import loggerMiddleware from "./logger";
import notFoundMiddleWare from "./notfound";
import {
  loginSchemaValidation,
  registerSchemaValidation,
  socialAuthValidation,
} from "./validation/user";

export {
  authMiddleware,
  catchAllErrorMiddleware,
  corsMiddleware,
  loggerMiddleware,
  loginSchemaValidation,
  notFoundMiddleWare,
  registerSchemaValidation,
  socialAuthValidation,
};
