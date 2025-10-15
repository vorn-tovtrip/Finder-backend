import { Router } from "express";
import { MessageController } from "../controller";
import { authMiddleware } from "../middleware";
import { RouteDefinition } from "../types/route";

export class MessageRouter {
  private readonly router: Router;
  private readonly controller: MessageController;

  constructor() {
    this.router = Router();
    this.controller = new MessageController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const routes: RouteDefinition[] = [
      {
        method: "get",
        path: "/",
        handler: this.controller.getAllMessages.bind(this.controller),
        middlewares: [authMiddleware],
      },
      {
        method: "get",
        path: "/conversations/:userId",
        handler: this.controller.getUserConversations.bind(this.controller),
        middlewares: [authMiddleware],
        //This will list all chats with last message, like Messenger.
      },

      {
        method: "get",
        path: "/userA/:currentUser/userB/:userId",
        handler: this.controller.getMessageBetween.bind(this.controller),
        middlewares: [authMiddleware],
        //Then when the user clicks on a conversation, you fetch /messages?userA=X&userB=Y for the chat.
      },
    ];

    routes.forEach((route) => {
      if (route.middlewares && route.middlewares.length > 0) {
        this.router[route.method](
          route.path,
          ...route.middlewares,
          route.handler
        );
      } else {
        this.router[route.method](route.path, route.handler);
      }
    });
  }

  public initRoutes(): Router {
    return this.router;
  }
}
