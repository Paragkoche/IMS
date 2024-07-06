import { Router } from "express";
import * as Controller from "../controller";
const router = Router();

router.get("/dashboard", Controller.dp_dashboard);

router.post("/set-up", Controller.dp_setUp);

router.put("/delivered-order");

router.put("/cancel-order");

router.get("/all-orders");

export default router;
