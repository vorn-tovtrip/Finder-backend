"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCategoryController = void 0;
const lib_1 = require("../lib");
const service_1 = require("../service");
const utils_1 = require("../utils");
class ReportCategoryController {
    constructor() {
        this.getAll = async (_, res) => {
            const categories = await this.reportCategoryService.findAll();
            return (0, utils_1.SuccessResponse)({ res, data: categories, statusCode: 200 });
        };
        this.getById = async (req, res) => {
            const { id } = req.params;
            const category = await this.reportCategoryService.findById(Number(id));
            if (!category)
                return res.status(404).json({ message: "Category not found" });
            return (0, utils_1.SuccessResponse)({ res, data: category, statusCode: 200 });
        };
        this.create = async (req, res) => {
            const { name } = req.body;
            const category = await this.reportCategoryService.create(name);
            return (0, utils_1.SuccessResponse)({ res, data: category, statusCode: 201 });
        };
        this.update = async (req, res) => {
            const { id } = req.params;
            const { name } = req.body;
            const category = await this.reportCategoryService.update(Number(id), name);
            return (0, utils_1.SuccessResponse)({ res, data: category, statusCode: 200 });
        };
        this.delete = async (req, res) => {
            const { id } = req.params;
            const category = await this.reportCategoryService.delete(Number(id));
            return (0, utils_1.SuccessResponse)({ res, data: category, statusCode: 200 });
        };
        this.reportCategoryService = new service_1.ReportCategoryService(lib_1.PrismaClient);
    }
}
exports.ReportCategoryController = ReportCategoryController;
