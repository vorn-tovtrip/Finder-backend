import { Router } from "express";
import ExampleController from "../controller/example.controller";
import { exampleRateLimit } from "../middleware";

const router = Router();
router.use("/example", exampleRateLimit, ExampleController.getAllData);

export default router;
