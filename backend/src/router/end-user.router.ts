import { Router } from "express";
import * as controller from "../controller";

const router = Router();

router.get("/profile", controller.EU_profile);
router.get("/all-orders", controller.EU_getAllOrders);
router.get("/orders-bill/:orderId", controller.EU_OrderBill);

router.post("/add-order", controller.EU_AddOrder);

router.put("/update-order", controller.EU_updateOrder);
router.put("/update-profile", controller.EU_updateProfile);

export default router;