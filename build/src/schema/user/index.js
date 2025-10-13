"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const login_1 = require("../login");
exports.updateUserSchema = login_1.socialAuthSchema.partial();
