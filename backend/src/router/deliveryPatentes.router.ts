import { Router } from "express";

const router = Router();

router.get("/dashboard");

router.post("/set-up");

router.put("/delivered-order");

router.put("/cancel-order");

router.get("/all-orders");

export default router;
