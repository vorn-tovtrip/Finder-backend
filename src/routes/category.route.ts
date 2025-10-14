import { Router } from "express";
import { ReportCategoryController } from "../controller/category.controller";
import { authMiddleware, validateSchemaMiddleware } from "../middleware";
import { createReportCategorySchema } from "../schema/category";

export class ReportCategoryRouter {
  private readonly router: Router;
  private readonly controller: ReportCategoryController;

  constructor() {
    this.router = Router();
    this.controller = new ReportCategoryController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", authMiddleware, this.controller.getAll);
    this.router.get("/:id", authMiddleware, this.controller.getById);
    this.router.post(
      "/",
      authMiddleware,
      validateSchemaMiddleware(createReportCategorySchema),
      this.controller.create
    );
    this.router.put(
      "/:id",
      authMiddleware,
      validateSchemaMiddleware(createReportCategorySchema),
      this.controller.update
    );
    this.router.delete("/:id", authMiddleware, this.controller.delete);
  }

  public initRoutes(): Router {
    return this.router;
  }
}
