"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const catchAllErrorMiddleware = (err, req, res, next) => {
    console.log("Catch all error middleware run", err);
    if (err instanceof zod_1.ZodError) {
        const errorMessage = err.errors.map((e) => e.path + " " + e.message);
        res.status(400).json({
            message: errorMessage,
            code: 400,
            data: null,
        });
        return;
    }
    if (typeof err == "string") {
        res.status(400).json({
            message: err,
            code: 400,
            data: null,
        });
        return;
    }
    res.status(500).json({
        message: err.message || "Something went wrong!!!",
        code: 500,
        data: null,
    });
};
exports.default = catchAllErrorMiddleware;
