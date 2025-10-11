"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBookId = exports.updateBookValidate = exports.createBookValidationMiddleware = void 0;
const schema_1 = require("../../schema");
const createBookValidationMiddleware = (req, res, next) => {
    const parsed = schema_1.createBookSchema.safeParse(req.body);
    if (!parsed.success) {
        next(parsed.error);
        return;
    }
    next();
};
exports.createBookValidationMiddleware = createBookValidationMiddleware;
const updateBookValidate = async (req, res, next) => {
    console.log(Object.keys(req.body));
    if (!req.body || !Object.keys(req.body).length) {
        return next("Body params must not be empty");
    }
    const updatedData = schema_1.updateBookSchema.safeParse(req.body);
    if (!updatedData.success) {
        return next(updatedData.error);
    }
    next();
};
exports.updateBookValidate = updateBookValidate;
const checkBookId = async (req, res, next) => {
    const id = +req.params.id;
    console.log("Check book id middleware run", id);
    if (!req.params.id) {
        return next("Book id must not be empty");
    }
    if (isNaN(id)) {
        return next("Book id must be a number");
    }
    next();
};
exports.checkBookId = checkBookId;
