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
        const routes = [
            {
                method: "get",
                path: "/",
                handler: this.controller.getAll.bind(this.controller),
                middlewares: [middleware_1.authMiddleware],
            },
            {
                method: "post",
                path: "/test",
                handler: this.controller.sendTestUser.bind(this.controller),
                middlewares: [
                    middleware_1.authMiddleware,
                    (0, middleware_1.validateSchemaMiddleware)(notification_1.testCreateNotificationSchema),
                ],
            },
            {
                method: "get",
                path: "/:id",
                handler: this.controller.getById.bind(this.controller),
                middlewares: [middleware_1.authMiddleware],
            },
            {
                method: "get",
                path: "/user/:userId",
                handler: this.controller.getByUser.bind(this.controller),
                middlewares: [middleware_1.authMiddleware],
            },
            {
                method: "post",
                path: "/",
                handler: this.controller.create.bind(this.controller),
                middlewares: [
                    middleware_1.authMiddleware,
                    (0, middleware_1.validateSchemaMiddleware)(notification_1.createNotificationSchema),
                ],
            },
            {
                method: "delete",
                path: "/:id",
                handler: this.controller.delete.bind(this.controller),
                middlewares: [middleware_1.authMiddleware],
            },
        ];
        // Register all routes dynamically
        routes.forEach((route) => {
            if (route.middlewares && route.middlewares.length > 0) {
                this.router[route.method](route.path, ...route.middlewares, route.handler);
            }
            else {
                this.router[route.method](route.path, route.handler);
            }
        });
    }
    initRoutes() {
        return this.router;
    }
}
exports.NotificationRouter = NotificationRouter;
