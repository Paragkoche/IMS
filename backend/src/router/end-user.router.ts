import { Router } from "express";

const router = Router();

router.get("/profile");
router.get("/all-orders");
router.get("/orders-bill/:orderId");

router.post("/add-order");

router.put("/update-order");
router.put("/update-profile");

export default router;
