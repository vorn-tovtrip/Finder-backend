import { Router } from "express";
import { ReportController } from "../controller";
import {
  authMiddleware,
  validateReportQueryMiddleware,
  validateSchemaMiddleware,
} from "../middleware";
import {
  createReportSchema,
  updateReportSchema,
  updateStatusReportSchema,
} from "../schema";
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
        middlewares: [authMiddleware, validateReportQueryMiddleware],
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
        method: "put",
        path: "/:id/status/update-chat-owner",
        handler: this.reportController.updateStatusChatOwner.bind(
          this.reportController
        ),
        middlewares: [
          authMiddleware,
          validateSchemaMiddleware(updateStatusReportSchema),
        ],
      },
      {
        method: "put",
        path: "/:id/status/confirm-found",
        handler: this.reportController.updateStatusConfirm.bind(
          this.reportController
        ),
        middlewares: [
          authMiddleware,
          validateSchemaMiddleware(updateStatusReportSchema),
        ],
      },
      {
        method: "delete",
        path: "/:id/status/cancel",
        handler: this.reportController.updateStatusCancel.bind(
          this.reportController
        ),
        middlewares: [
          authMiddleware,
          validateSchemaMiddleware(updateStatusReportSchema),
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
