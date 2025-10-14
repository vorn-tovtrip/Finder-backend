"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCategoryRouter = void 0;
const express_1 = require("express");
const category_controller_1 = require("../controller/category.controller");
const middleware_1 = require("../middleware");
const category_1 = require("../schema/category");
class ReportCategoryRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new category_controller_1.ReportCategoryController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", middleware_1.authMiddleware, this.controller.getAll);
        this.router.get("/:id", middleware_1.authMiddleware, this.controller.getById);
        this.router.post("/", middleware_1.authMiddleware, (0, middleware_1.validateSchemaMiddleware)(category_1.createReportCategorySchema), this.controller.create);
        this.router.put("/:id", middleware_1.authMiddleware, (0, middleware_1.validateSchemaMiddleware)(category_1.createReportCategorySchema), this.controller.update);
        this.router.delete("/:id", middleware_1.authMiddleware, this.controller.delete);
    }
    initRoutes() {
        return this.router;
    }
}
exports.ReportCategoryRouter = ReportCategoryRouter;
