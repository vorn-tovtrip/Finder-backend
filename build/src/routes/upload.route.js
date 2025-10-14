"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageRouter = void 0;
const express_1 = require("express");
const storage_controller_1 = require("../controller/storage.controller");
const middleware_1 = require("../middleware");
class StorageRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new storage_controller_1.StorageController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/", middleware_1.authMiddleware, this.controller.uploadFile);
        this.router.delete("/", middleware_1.authMiddleware, this.controller.deleteFile);
    }
    initRoutes() {
        return this.router;
    }
}
exports.StorageRouter = StorageRouter;
