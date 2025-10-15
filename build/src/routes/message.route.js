"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRouter = void 0;
const express_1 = require("express");
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
class MessageRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new controller_1.MessageController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        const routes = [
            {
                method: "get",
                path: "/",
                handler: this.controller.getAllMessages.bind(this.controller),
                middlewares: [middleware_1.authMiddleware],
            },
            {
                method: "get",
                path: "/conversations/:userId",
                handler: this.controller.getUserConversations.bind(this.controller),
                middlewares: [middleware_1.authMiddleware],
                //This will list all chats with last message, like Messenger.
            },
            {
                method: "get",
                path: "/userA/:currentUser/userB/:userId",
                handler: this.controller.getMessageBetween.bind(this.controller),
                middlewares: [middleware_1.authMiddleware],
                //Then when the user clicks on a conversation, you fetch /messages?userA=X&userB=Y for the chat.
            },
            {
                method: "delete",
                path: "/delete-all",
                handler: this.controller.deleteAllMessage.bind(this.controller),
                middlewares: [middleware_1.authMiddleware],
                //Then when the user clicks on a conversation, you fetch /messages?userA=X&userB=Y for the chat.
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
    initRoutes() {
        return this.router;
    }
}
exports.MessageRouter = MessageRouter;
