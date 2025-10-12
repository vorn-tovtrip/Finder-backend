"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("./user.route");
const router = (0, express_1.Router)();
const userRouter = new user_route_1.UserRouter();
router.use("/users", userRouter.getRouter());
exports.default = router;
