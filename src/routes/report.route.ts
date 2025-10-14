import { Router } from "express";
import { ReportController } from "../controller";
import { authMiddleware, validateSchemaMiddleware } from "../middleware";
import { createReportSchema, updateReportSchema } from "../schema";
import { RouteDefinition } from "../types/route";

export class ReportRouter {
  private readonly router: Router;
  private readonly reportController: ReportController;

  constructor() {
    this.router = Router();
    this.reportController = new ReportController();
    this.initializeRoutes();
    //Start initalize the route here
  }

  private initializeRoutes() {
    const routes: RouteDefinition[] = [
      {
        method: "get",
        path: "/",
        handler: this.reportController.getAllReports.bind(
          this.reportController
        ),
        middlewares: [authMiddleware],
      },
      {
        method: "get",
        path: "/:id",
        handler: this.reportController.getReportById.bind(
          this.reportController
        ),
        middlewares: [authMiddleware],
      },
      {
        method: "post",
        path: "/",
        handler: this.reportController.createReport.bind(this.reportController),
        middlewares: [
          authMiddleware,
          validateSchemaMiddleware(createReportSchema),
        ],
      },
      {
        method: "put",
        path: "/:id",
        handler: this.reportController.updateReport.bind(this.reportController),
        middlewares: [
          authMiddleware,
          validateSchemaMiddleware(updateReportSchema),
        ],
      },
      {
        method: "delete",
        path: "/:id",
        handler: this.reportController.deleteReport.bind(this.reportController),
        middlewares: [authMiddleware],
      },
    ];

    routes.forEach((route) => {
      if (route.middlewares && route.middlewares.length > 0) {
        this.router[route.method](
          route.path,
          ...route.middlewares,
          route.handler
        );
      } else {
        this.router[route.method](route.path, route.handler);
      }
    });
  }

  public initRoutes(): Router {
    //This will call the constructor back
    return this.router;
  }
}
