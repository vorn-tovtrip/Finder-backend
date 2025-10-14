import { Router } from "express";
import { UserController } from "../controller";
import {
  authMiddleware,
  validateReportQueryMiddleware,
  validateSchemaMiddleware,
} from "../middleware";
import {
  authenticationSchema,
  loginSchema,
  socialAuthSchema,
  updateUserSchema,
} from "../schema";
import { RouteDefinition } from "../types/route";

export class UserRouter {
  private readonly router: Router;
  private readonly userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
    //Start initalize the route here
  }

  private initializeRoutes() {
    const routes: RouteDefinition[] = [
      {
        method: "get",
        path: "/",
        handler: this.userController.getUsers.bind(this.userController),
        middlewares: [authMiddleware],
      },
      {
        method: "get",
        path: "/:userId/report/latest",
        handler: this.userController.getReportLostLatest.bind(
          this.userController
        ),
        middlewares: [authMiddleware],
      },
      {
        method: "put",
        path: "/:id",
        handler: this.userController.patchUser.bind(this.userController),
        middlewares: [authMiddleware],
      },
      {
        method: "get",
        path: "/:id/history-report-all",
        handler: this.userController.getReportHistoryUser.bind(
          this.userController
        ),
        middlewares: [authMiddleware, validateReportQueryMiddleware],
      },
      {
        method: "post",
        path: "/register",
        handler: this.userController.registerUser.bind(this.userController),
        middlewares: [validateSchemaMiddleware(authenticationSchema)],
      },
      {
        method: "post",
        path: "/login",
        handler: this.userController.loginUser.bind(this.userController),
        middlewares: [validateSchemaMiddleware(loginSchema)],
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
        middlewares: [authMiddleware],
      },
      {
        method: "post",
        path: "/social-login",
        handler: this.userController.socialAuth.bind(this.userController),
        middlewares: [validateSchemaMiddleware(socialAuthSchema)],
      },
      {
        method: "put",
        path: "/:id",
        handler: this.userController.patchUser.bind(this.userController),
        middlewares: [
          authMiddleware,
          validateSchemaMiddleware(updateUserSchema),
        ],
      },
      {
        method: "post",
        path: "/update-me",
        handler: this.userController.updateFcmToken.bind(this.userController),
        middlewares: [authMiddleware],
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
    //This will call the constructor back
    return this.router;
  }
}
