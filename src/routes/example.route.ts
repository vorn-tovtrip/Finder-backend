import { Router } from "express";
import ExampleController from "../controller/example.controller";
const router = Router();
router.get("/", ExampleController.getAllData);

export default router;
