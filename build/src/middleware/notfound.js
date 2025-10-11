"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundMiddleWare = (req, res, next) => {
    res.status(404).json({
        code: 404,
        data: [],
        message: "Not found",
    });
};
exports.default = notFoundMiddleWare;
