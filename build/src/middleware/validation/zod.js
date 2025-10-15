"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchemaMiddleware = void 0;
const validateSchemaMiddleware = (schema) => (req, _, next) => {
    const parsed = schema.safeParse(req.body);
    console.log("Middle ware validation run");
    if (!parsed.success) {
        // Send validation errors or pass to error handler
        return next(parsed.error);
    }
    // Replace req.body with the validated data
    req.body = parsed.data;
    next();
};
exports.validateSchemaMiddleware = validateSchemaMiddleware;
