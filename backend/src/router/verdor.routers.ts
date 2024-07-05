import { Router } from "express";

const router = Router();

router.get("/dashboard");

router.post("/set-up");

router.put("/order-res");

router.get("/all-orders");

export default router;
