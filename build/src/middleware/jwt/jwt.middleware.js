"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const utils_1 = require("../../utils");
const authMiddleware = async (req, res, next) => {
    const user = await (0, utils_1.getUserFromRequest)(req);
    if (!user) {
        return (0, utils_1.ErrorResponse)({
            res,
            data: null,
            statusCode: 401,
            error: "Unauthorized",
        });
    }
    req.user = user;
    next();
};
exports.authMiddleware = authMiddleware;
