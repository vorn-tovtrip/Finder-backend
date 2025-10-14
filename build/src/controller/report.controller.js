"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const lib_1 = require("../lib");
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
        this.updateStatusChatOwner = async (req, res) => {
            const id = Number(req.params.id);
            const parsed = schema_1.updateStatusReportSchema.safeParse(req.body);
            // ** Add logic to send notification to the owner that own that report
            // ** User Id here is the one that report
            if (parsed.data && parsed.success) {
                const report = await this.reportService.updateReportStatus(id, parseInt(parsed.data.userId), "CHATOWNER");
                const userIdreport = report.userId;
                console.log(">>> Send notification to ", userIdreport);
                return (0, utils_1.SuccessResponse)({ res, data: report, statusCode: 201 });
            }
        };
        this.updateStatusConfirm = async (req, res) => {
            const id = Number(req.params.id);
            const parsed = schema_1.updateStatusReportSchema.safeParse(req.body);
            // ** User Id here is the one that confirm
            if (parsed.data && parsed.success) {
                const report = await this.reportService.updateReportStatus(id, parseInt(parsed.data.userId), "COMPLETED");
                return (0, utils_1.SuccessResponse)({ res, data: report, statusCode: 201 });
            }
        };
        this.updateStatusCancel = async (req, res) => {
            const id = Number(req.params.id);
            const parsed = schema_1.updateStatusReportSchema.safeParse(req.body);
            // ** Need user id just incase not delete that report
            if (parsed.data && parsed.success) {
                const report = await this.reportService.deleteReport(id);
                return (0, utils_1.SuccessResponse)({ res, data: report, statusCode: 201 });
            }
        };
        this.deleteReport = async (req, res) => {
            const id = Number(req.params.id);
            const report = await this.reportService.deleteReport(id);
            return (0, utils_1.SuccessResponse)({
                res,
                data: report,
                statusCode: 201,
            });
        };
        this.reportService = new service_1.ReportService(lib_1.PrismaClient);
        this.userService = new service_1.UserService(lib_1.PrismaClient);
    }
}
exports.ReportController = ReportController;
