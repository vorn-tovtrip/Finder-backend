"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeController = void 0;
const lib_1 = require("../lib");
const badge_service_1 = require("../service/badge.service");
const utils_1 = require("../utils");
class BadgeController {
    constructor() {
        this.getAll = async (_, res) => {
            const badges = await this.badgeService.findAllBadges();
            return (0, utils_1.SuccessResponse)({ res, data: badges, statusCode: 200 });
        };
        this.getById = async (req, res) => {
            const id = parseInt(req.params.id);
            const badge = await this.badgeService.findBadgeById(id);
            if (!badge)
                return (0, utils_1.ErrorResponse)({
                    res,
                    data: "Badge is not found",
                    statusCode: 400,
                });
            return (0, utils_1.SuccessResponse)({ res, data: badge, statusCode: 200 });
        };
        this.create = async (req, res) => {
            const badge = await this.badgeService.createBadge(req.body);
            return (0, utils_1.SuccessResponse)({ res, data: badge, statusCode: 201 });
        };
        this.update = async (req, res) => {
            const id = parseInt(req.params.id);
            const badge = await this.badgeService.updateBadge(id, req.body);
            return (0, utils_1.SuccessResponse)({ res, data: badge, statusCode: 200 });
        };
        this.delete = async (req, res) => {
            const id = parseInt(req.params.id);
            const badge = await this.badgeService.deleteBadge(id);
            return (0, utils_1.SuccessResponse)({ res, data: badge, statusCode: 200 });
        };
        this.badgeService = new badge_service_1.BadgeService(lib_1.PrismaClient);
    }
}
exports.BadgeController = BadgeController;
