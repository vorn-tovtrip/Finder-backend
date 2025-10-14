"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReportQueryMiddleware = exports.checkParamsId = void 0;
const schema_1 = require("../../schema");
const checkParamsId = async (req, res, next) => {
    const id = +req.params.id;
    console.log("Middleware params chekc", id);
    if (!req.params.id) {
        return next("Params id must not be empty");
    }
    if (isNaN(id)) {
        return next("Params id must be a number");
    }
    next();
};
exports.checkParamsId = checkParamsId;
const validateReportQueryMiddleware = (req, _res, next) => {
    try {
        const query = schema_1.getAllReportsQuerySchema.parse(req.query);
        const filters = {};
        if (query.categoryId)
            filters.categoryId = query.categoryId;
        if (query.type)
            filters.type = query.type;
        if (query.search) {
            filters.OR = [
                { title: { contains: query.search, mode: "insensitive" } },
                { description: { contains: query.search, mode: "insensitive" } },
            ];
        }
        if (query.status)
            filters.status = query.status;
        req.filters = filters;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateReportQueryMiddleware = validateReportQueryMiddleware;
