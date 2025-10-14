"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRouter = void 0;
const express_1 = require("express");
const notification_controller_1 = require("../controller/notification.controller");
const middleware_1 = require("../middleware");
const notification_1 = require("../schema/notification");
class NotificationRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new notification_controller_1.NotificationController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", middleware_1.authMiddleware, this.controller.getAll);
        this.router.get("/:id", middleware_1.authMiddleware, this.controller.getById);
        this.router.get("/user/:userId", middleware_1.authMiddleware, this.controller.getByUser);
        this.router.post("/", middleware_1.authMiddleware, (0, middleware_1.validateSchemaMiddleware)(notification_1.createNotificationSchema), this.controller.create);
        this.router.put("/:id", middleware_1.authMiddleware, (0, middleware_1.validateSchemaMiddleware)(notification_1.updateNotificationSchema), this.controller.update);
        this.router.delete("/:id", middleware_1.authMiddleware, this.controller.delete);
    }
    initRoutes() {
        return this.router;
    }
}
exports.NotificationRouter = NotificationRouter;
