import { Router } from "express";
import { StorageController } from "../controller/storage.controller";
import { authMiddleware } from "../middleware";

export class StorageRouter {
  private readonly router: Router;
  private readonly controller: StorageController;

  constructor() {
    this.router = Router();
    this.controller = new StorageController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authMiddleware, this.controller.uploadFile);
    this.router.delete("/", authMiddleware, this.controller.deleteFile);
  }

  public initRoutes(): Router {
    return this.router;
  }
}
