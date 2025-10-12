"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = exports.SuccessResponse = void 0;
const SuccessResponse = ({ res, data, statusCode, }) => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        data,
    });
};
exports.SuccessResponse = SuccessResponse;
const ErrorResponse = ({ res, data, statusCode, error, }) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        data,
        ...(error && { error }),
    });
};
exports.ErrorResponse = ErrorResponse;
