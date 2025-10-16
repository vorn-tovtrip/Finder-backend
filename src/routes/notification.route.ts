import { Router } from "express";
import { NotificationController } from "../controller/notification.controller";
import { authMiddleware, validateSchemaMiddleware } from "../middleware";
import {
  createNotificationSchema,
  testCreateNotificationSchema,
} from "../schema/notification";
import { RouteDefinition } from "../types/route";

export class NotificationRouter {
  private readonly router: Router;
  private readonly controller: NotificationController;

  constructor() {
    this.router = Router();
    this.controller = new NotificationController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const routes: RouteDefinition[] = [
      {
        method: "get",
        path: "/",
        handler: this.controller.getAll.bind(this.controller),
        middlewares: [authMiddleware],
      },
      {
        method: "post",
        path: "/test",
        handler: this.controller.sendTestUser.bind(this.controller),
        middlewares: [
          authMiddleware,
          validateSchemaMiddleware(testCreateNotificationSchema),
        ],
      },
      {
        method: "get",
        path: "/:id",
        handler: this.controller.getById.bind(this.controller),
        middlewares: [authMiddleware],
      },
      {
        method: "get",
        path: "/user/:userId",
        handler: this.controller.getByUser.bind(this.controller),
        middlewares: [authMiddleware],
      },

      {
        method: "post",
        path: "/",
        handler: this.controller.create.bind(this.controller),
        middlewares: [
          authMiddleware,
          validateSchemaMiddleware(createNotificationSchema),
        ],
      },
      {
        method: "delete",
        path: "/:id",
        handler: this.controller.delete.bind(this.controller),
        middlewares: [authMiddleware],
      },
    ];

    // Register all routes dynamically
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
    return this.router;
  }
}
