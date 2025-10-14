import { Router } from "express";
import { BadgeRouter } from "./badge.route";
import { ReportCategoryRouter } from "./category.route";
import { ReportRouter } from "./report.route";
import { StorageRouter } from "./upload.route";
import { UserRouter } from "./user.route";

const router = Router();
const userRouter = new UserRouter();
const categoryRouter = new ReportCategoryRouter();
const reportRouter = new ReportRouter();
const badgeRouter = new BadgeRouter();
const storageRouter = new StorageRouter();

router.use("/users", userRouter.initRoutes());
router.use("/reports", reportRouter.initRoutes());
router.use("/categories", categoryRouter.initRoutes());
router.use("/badges", badgeRouter.initRoutes());
router.use("/upload", storageRouter.initRoutes());

export default router;
