"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const utils_1 = require("../utils");
const catchAllErrorMiddleware = (err, req, res, next) => {
    console.log("Catch all error middleware run", err);
    if (err instanceof zod_1.ZodError) {
        const errors = err.errors.map((e) => ({
            key: e.path[0],
            message: e.message,
        }));
        return (0, utils_1.ErrorResponse)({
            res,
            data: null,
            error: errors,
            statusCode: 400,
        });
    }
    if (typeof err == "string") {
        return (0, utils_1.ErrorResponse)({
            res,
            data: [],
            error: err,
            statusCode: 400,
        });
    }
    return (0, utils_1.ErrorResponse)({
        res,
        data: null,
        error: err.message || "Something went wrong!!!",
        statusCode: 500,
    });
};
exports.default = catchAllErrorMiddleware;
