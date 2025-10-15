"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const lib_1 = require("../lib");
const io_1 = require("../lib/socket/io");
const schema_1 = require("../schema");
const service_1 = require("../service");
const utils_1 = require("../utils");
class ReportController {
    constructor() {
        this.getAllReports = async (req, res) => {
            try {
                const filters = req.filters;
                const reports = await this.reportService.findAllReports(filters);
                return (0, utils_1.SuccessResponse)({ res, data: reports, statusCode: 200 });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Internal server error" });
            }
        };
        this.getReportById = async (req, res) => {
            const id = Number(req.params.id);
            const report = await this.reportService.findReportById(id);
            return (0, utils_1.SuccessResponse)({ res, data: report, statusCode: 200 });
        };
        this.createReport = async (req, res, next) => {
            let imageId;
            const parsed = schema_1.createReportSchema.safeParse(req.body);
            if (parsed.data) {
                const user = await this.userService.findUserById(parsed.data.userId);
                if (!user) {
                    return next("User with the id does not exist");
                }
                const report = await this.reportService.createReport({
                    ...parsed.data,
                    imageId: imageId,
                });
                return (0, utils_1.SuccessResponse)({ res, data: report, statusCode: 201 });
            }
        };
        this.updateReport = async (req, res) => {
            const id = Number(req.params.id);
            const parsed = schema_1.updateReportSchema.safeParse(req.body);
            if (!parsed.success)
                return res
                    .status(400)
                    .json({ message: "Validation error", errors: parsed.error.errors });
            const report = await this.reportService.updateReport(id, parsed.data);
            return (0, utils_1.SuccessResponse)({ res, data: report, statusCode: 201 });
        };
        this.updateStatusChatOwner = async (req, res, next) => {
            const id = Number(req.params.id);
            console.log("Params i", id);
            const parsed = schema_1.updateStatusReportSchema.safeParse(req.body);
            const reportExist = await this.reportService.findReportById(id);
            if (!reportExist) {
                next("Report does not exist with that id");
            }
            // ** Add logic to send notification to the owner that own that report
            // ** User Id here is the one that report
            // ** Send Notification to the owner report that someone has found your
            if (parsed.data && parsed.success) {
                const report = await this.reportService.updateReportStatus(id, parsed.data.userId, "CHATOWNER");
                const userIdreport = report.userId;
                console.log(">>> Send notification to ", userIdreport);
                // Create empty chat (optional: after confirming, notify/report owner)
                const senderId = parsed.data.userId; // user who confirms
                const receiverId = userIdreport; // owner of the report
                await this.createChatBetweenUser(senderId, receiverId);
                return (0, utils_1.SuccessResponse)({ res, data: report, statusCode: 201 });
            }
        };
        this.updateStatusConfirm = async (req, res, next) => {
            const id = Number(req.params.id);
            const parsed = schema_1.updateStatusReportSchema.safeParse(req.body);
            const reportExist = await this.reportService.findReportById(id);
            if (!reportExist) {
                next("Report does not exist with that id");
            }
            // ** User Id here is the one that confirm
            // ** Send Notification to the user that you success earn a badge
            if (parsed.data && parsed.success) {
                const report = await this.reportService.updateReportStatus(id, parsed.data.userId, "COMPLETED");
                return (0, utils_1.SuccessResponse)({ res, data: report, statusCode: 201 });
            }
        };
        this.updateStatusCancel = async (req, res, next) => {
            const id = Number(req.params.id);
            const parsed = schema_1.updateStatusReportSchema.safeParse(req.body);
            const reportExist = await this.reportService.findReportById(id);
            if (!reportExist) {
                next("Report does not exist with that id");
            }
            // ** Need user id just incase not delete that report
            if (parsed.data && parsed.success) {
                const report = await this.reportService.deleteReport(id);
                return (0, utils_1.SuccessResponse)({ res, data: report, statusCode: 201 });
            }
        };
        this.deleteReport = async (req, res, next) => {
            const id = Number(req.params.id);
            const reportExist = await this.reportService.findReportById(id);
            if (!reportExist) {
                next("Report does not exist with that id");
            }
            const report = await this.reportService.deleteReport(id);
            return (0, utils_1.SuccessResponse)({
                res,
                data: report,
                statusCode: 201,
            });
        };
        this.reportService = new service_1.ReportService(lib_1.PrismaClient);
        this.userService = new service_1.UserService(lib_1.PrismaClient);
        this.messageService = new service_1.MessageService(lib_1.PrismaClient);
    }
    async createChatBetweenUser(senderId, receiverId) {
        try {
            const content = "Hey I have a report related to your item";
            // 1Create message in DB
            const message = await this.messageService.createMessage(senderId, receiverId, content);
            console.log(">>> Chat created between", senderId, "and", receiverId);
            // Emit events to receiver if online
            const receiverSocket = io_1.onlineUsers[receiverId.toString()];
            if (receiverSocket && io_1.ioInstance) {
                // Receiver gets the new message
                io_1.ioInstance.to(receiverSocket).emit("receiveMessage", message);
                // notify receiver that a new message was sent
                io_1.ioInstance.to(receiverSocket).emit("sendMessage", message);
            }
            // Emit events to sender if online
            const senderSocket = io_1.onlineUsers[senderId.toString()];
            if (senderSocket && io_1.ioInstance) {
                // Sender also sees their own message
                io_1.ioInstance.to(senderSocket).emit("receiveMessage", message);
                // trigger sendMessage event on sender side as well
                io_1.ioInstance.to(senderSocket).emit("sendMessage", message);
            }
        }
        catch (error) {
            console.error("Error creating chat:", error);
        }
    }
}
exports.ReportController = ReportController;
