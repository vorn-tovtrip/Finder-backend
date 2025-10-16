"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const lib_1 = require("../lib");
const notification_1 = require("../schema/notification");
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
        this.sendTestUser = async (req, res) => {
            const parse = notification_1.testCreateNotificationSchema.safeParse(req.body);
            console.log("Run");
            if (parse.data) {
                // Here send notificaiton to user
            }
            return (0, utils_1.SuccessResponse)({ res, data: parse.data, statusCode: 200 });
        };
        this.create = async (req, res) => {
            try {
                const parseData = await notification_1.createNotificationSchema.safeParse(req.body);
                if (parseData.data) {
                    const notification = await this.notificationService.create({
                        ...parseData.data,
                        status: "PENDING",
                        userId: parseData.data.userId,
                    }, parseInt(parseData.data.reportId));
                    return (0, utils_1.SuccessResponse)({
                        res,
                        data: notification,
                        statusCode: 201,
                    });
                }
            }
            catch (error) {
                return (0, utils_1.ErrorResponse)({
                    res,
                    statusCode: 500,
                    data: null,
                    error: error instanceof Error ? error.message : "Internal server error",
                });
            }
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
