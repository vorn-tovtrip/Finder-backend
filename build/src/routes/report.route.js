"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRouter = void 0;
const express_1 = require("express");
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class ReportRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.reportController = new controller_1.ReportController();
        this.initializeRoutes();
        //Start initalize the route here
    }
    initializeRoutes() {
        const routes = [
            {
                method: "get",
                path: "/",
                handler: this.reportController.getAllReports.bind(this.reportController),
                middlewares: [middleware_1.authMiddleware, middleware_1.validateReportQueryMiddleware],
            },
            {
                method: "get",
                path: "/:id",
                handler: this.reportController.getReportById.bind(this.reportController),
                middlewares: [middleware_1.authMiddleware],
            },
            {
                method: "post",
                path: "/",
                handler: this.reportController.createReport.bind(this.reportController),
                middlewares: [
                    middleware_1.authMiddleware,
                    (0, middleware_1.validateSchemaMiddleware)(schema_1.createReportSchema),
                ],
            },
            {
                method: "put",
                path: "/:id",
                handler: this.reportController.updateReport.bind(this.reportController),
                middlewares: [
                    middleware_1.authMiddleware,
                    (0, middleware_1.validateSchemaMiddleware)(schema_1.updateReportSchema),
                ],
            },
            {
                method: "put",
                path: "/:id/status/update-chat-owner",
                handler: this.reportController.updateStatusChatOwner.bind(this.reportController),
                middlewares: [
                    middleware_1.authMiddleware,
                    (0, middleware_1.validateSchemaMiddleware)(schema_1.updateStatusReportSchema),
                ],
            },
            {
                method: "put",
                path: "/:id/status/confirm-found",
                handler: this.reportController.updateStatusConfirm.bind(this.reportController),
                middlewares: [
                    middleware_1.authMiddleware,
                    (0, middleware_1.validateSchemaMiddleware)(schema_1.updateStatusReportSchema),
                ],
            },
            {
                method: "delete",
                path: "/:id/status/cancel",
                handler: this.reportController.updateStatusCancel.bind(this.reportController),
                middlewares: [
                    middleware_1.authMiddleware,
                    (0, middleware_1.validateSchemaMiddleware)(schema_1.updateStatusReportSchema),
                ],
            },
            {
                method: "delete",
                path: "/:id",
                handler: this.reportController.deleteReport.bind(this.reportController),
                middlewares: [middleware_1.authMiddleware],
            },
        ];
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
        //This will call the constructor back
        return this.router;
    }
}
exports.ReportRouter = ReportRouter;
