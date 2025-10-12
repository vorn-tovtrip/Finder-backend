import { Router } from "express";
import { UserRouter } from "./user.route";

const router = Router();
const userRouter = new UserRouter();
router.use("/users", userRouter.getRouter());

export default router;
