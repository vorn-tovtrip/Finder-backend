import { Router } from "express";
import { BadgeController } from "../controller/badge.controller";
import { authMiddleware, validateSchemaMiddleware } from "../middleware";
import { createBadgeSchema, updateBadgeSchema } from "../schema/badge";

export class BadgeRouter {
  private readonly router: Router;
  private readonly controller: BadgeController;

  constructor() {
    this.router = Router();
    this.controller = new BadgeController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", authMiddleware, this.controller.getAll);
    this.router.get("/:id", authMiddleware, this.controller.getById);

    this.router.post(
      "/",
      authMiddleware,
      validateSchemaMiddleware(createBadgeSchema),
      this.controller.create
    );

    this.router.put(
      "/:id",
      authMiddleware,
      validateSchemaMiddleware(updateBadgeSchema),
      this.controller.update
    );

    this.router.delete("/:id", authMiddleware, this.controller.delete);
  }

  public initRoutes(): Router {
    return this.router;
  }
}
