import corsMiddleware from "./cors";
import catchAllErrorMiddleware from "./error";
import { authMiddleware } from "./jwt/jwt.middleware";
import loggerMiddleware from "./logger";
import notFoundMiddleWare from "./notfound";
import { validateSchemaMiddleware } from "./validation/zod";
export {
  authMiddleware,
  catchAllErrorMiddleware,
  corsMiddleware,
  loggerMiddleware,
  notFoundMiddleWare,
  validateSchemaMiddleware,
};
