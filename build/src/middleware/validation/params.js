"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkParamsId = void 0;
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
