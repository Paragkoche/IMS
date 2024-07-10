import { Router } from "express";
import * as Controller from "../controller";
const router = Router();

router.get("/dashboard", Controller.dp_dashboard);

router.post("/set-up", Controller.dp_setUp);

router.put("/status-order", Controller.dp_deliveredOrder);

router.get("/all-orders", Controller.dp_getAllOrders);

export default router;
