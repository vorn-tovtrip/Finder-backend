"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const lib_1 = require("../lib");
const notification_service_1 = require("../service/notification.service");
const utils_1 = require("../utils");
class NotificationController {
    constructor() {
        this.getAll = async (_, res) => {
            const notifications = await this.notificationService.findAll();
            return (0, utils_1.SuccessResponse)({ res, data: notifications, statusCode: 200 });
        };
        this.getById = async (req, res) => {
            const id = parseInt(req.params.id);
            const notification = await this.notificationService.findById(id);
            if (!notification)
                return res.status(404).json({ message: "Notification not found" });
            return (0, utils_1.SuccessResponse)({ res, data: notification, statusCode: 200 });
        };
        this.getByUser = async (req, res) => {
            const userId = parseInt(req.params.userId);
            const notifications = await this.notificationService.findByUserId(userId);
            return (0, utils_1.SuccessResponse)({ res, data: notifications, statusCode: 200 });
        };
        this.create = async (req, res) => {
            const notification = await this.notificationService.create(req.body);
            return (0, utils_1.SuccessResponse)({ res, data: notification, statusCode: 201 });
        };
        this.update = async (req, res) => {
            const id = parseInt(req.params.id);
            const updated = await this.notificationService.update(id, req.body);
            return (0, utils_1.SuccessResponse)({ res, data: updated, statusCode: 200 });
        };
        this.delete = async (req, res) => {
            const id = parseInt(req.params.id);
            const deleted = await this.notificationService.delete(id);
            return (0, utils_1.SuccessResponse)({ res, data: deleted, statusCode: 200 });
        };
        this.notificationService = new notification_service_1.NotificationService(lib_1.PrismaClient);
    }
}
exports.NotificationController = NotificationController;
