"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialAuthValidation = exports.loginSchemaValidation = exports.registerSchemaValidation = void 0;
const schema_1 = require("../../schema");
const registerSchemaValidation = (req, _, next) => {
    const parsed = schema_1.authenticationSchema.safeParse(req.body);
    if (!parsed.success) {
        // Return validation errors
        return next(parsed.error);
    }
    req.body = parsed.data;
    next();
};
exports.registerSchemaValidation = registerSchemaValidation;
const loginSchemaValidation = (req, _, next) => {
    const parsed = schema_1.loginSchema.safeParse(req.body);
    if (!parsed.success) {
        // Return validation errors
        return next(parsed.error);
    }
    req.body = parsed.data;
    next();
};
exports.loginSchemaValidation = loginSchemaValidation;
const socialAuthValidation = (req, _, next) => {
    const parsed = schema_1.socialAuthSchema.safeParse(req.body);
    if (!parsed.success) {
        // Return validation errors
        return next(parsed.error);
    }
    req.body = parsed.data;
    next();
};
exports.socialAuthValidation = socialAuthValidation;
