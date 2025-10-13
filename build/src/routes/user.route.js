"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class UserRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userController = new controller_1.UserController();
        this.initializeRoutes();
        //Start initalize the route here
    }
    initializeRoutes() {
        const routes = [
            {
                method: "get",
                path: "/",
                handler: this.userController.getUsers.bind(this.userController),
                middlewares: [middleware_1.authMiddleware],
            },
            {
                method: "put",
                path: "/:id",
                handler: this.userController.patchUser.bind(this.userController),
                middlewares: [middleware_1.authMiddleware],
            },
            {
                method: "post",
                path: "/register",
                handler: this.userController.registerUser.bind(this.userController),
                middlewares: [(0, middleware_1.validateSchemaMiddleware)(schema_1.authenticationSchema)],
            },
            {
                method: "post",
                path: "/login",
                handler: this.userController.loginUser.bind(this.userController),
                middlewares: [(0, middleware_1.validateSchemaMiddleware)(schema_1.loginSchema)],
            },
            {
                method: "delete",
                path: "/:id",
                handler: this.userController.deleteUser.bind(this.userController),
            },
            {
                method: "post",
                path: "/logout",
                handler: this.userController.logoutUser.bind(this.userController),
                middlewares: [middleware_1.authMiddleware],
            },
            {
                method: "post",
                path: "/social-login",
                handler: this.userController.socialAuth.bind(this.userController),
                middlewares: [(0, middleware_1.validateSchemaMiddleware)(schema_1.socialAuthSchema)],
            },
            {
                method: "put",
                path: "/:id",
                handler: this.userController.patchUser.bind(this.userController),
                middlewares: [
                    middleware_1.authMiddleware,
                    (0, middleware_1.validateSchemaMiddleware)(schema_1.updateUserSchema),
                ],
            },
            {
                method: "post",
                path: "/update-me",
                handler: this.userController.updateFcmToken.bind(this.userController),
                middlewares: [middleware_1.authMiddleware],
            },
        ];
        routes.forEach((route) => {
            if (route.middlewares && route.middlewares.length > 0) {
                this.router[route.method](route.path, ...route.middlewares, route.handler);
            }
            else {
                this.router[route.method](route.path, route.handler);
            }
        });
    }
    getRouter() {
        //This will call the constructor back
        return this.router;
    }
}
exports.UserRouter = UserRouter;
