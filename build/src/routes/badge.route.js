"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeRouter = void 0;
const express_1 = require("express");
const badge_controller_1 = require("../controller/badge.controller");
const middleware_1 = require("../middleware");
const badge_1 = require("../schema/badge");
class BadgeRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new badge_controller_1.BadgeController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", middleware_1.authMiddleware, this.controller.getAll);
        this.router.get("/:id", middleware_1.authMiddleware, this.controller.getById);
        this.router.post("/", middleware_1.authMiddleware, (0, middleware_1.validateSchemaMiddleware)(badge_1.createBadgeSchema), this.controller.create);
        this.router.put("/:id", middleware_1.authMiddleware, (0, middleware_1.validateSchemaMiddleware)(badge_1.updateBadgeSchema), this.controller.update);
        this.router.delete("/:id", middleware_1.authMiddleware, this.controller.delete);
    }
    initRoutes() {
        return this.router;
    }
}
exports.BadgeRouter = BadgeRouter;
