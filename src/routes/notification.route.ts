import { Router } from "express";
import { NotificationController } from "../controller/notification.controller";
import { authMiddleware, validateSchemaMiddleware } from "../middleware";
import {
  createNotificationSchema,
  updateNotificationSchema,
} from "../schema/notification";

export class NotificationRouter {
  private readonly router: Router;
  private readonly controller: NotificationController;

  constructor() {
    this.router = Router();
    this.controller = new NotificationController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", authMiddleware, this.controller.getAll);
    this.router.get("/:id", authMiddleware, this.controller.getById);
    this.router.get("/user/:userId", authMiddleware, this.controller.getByUser);

    this.router.post(
      "/",
      authMiddleware,
      validateSchemaMiddleware(createNotificationSchema),
      this.controller.create
    );

    this.router.put(
      "/:id",
      authMiddleware,
      validateSchemaMiddleware(updateNotificationSchema),
      this.controller.update
    );

    this.router.delete("/:id", authMiddleware, this.controller.delete);
  }

  public initRoutes(): Router {
    return this.router;
  }
}
