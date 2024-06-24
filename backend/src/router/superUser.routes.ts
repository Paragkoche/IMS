import { Router } from "express";

const router = Router();

router.get("/dashboard");

router.get("/admins");
router.post("/create-admin");
router.put("/update-admin");
router.delete("/delete-admin");

router.get("/store");
router.post("/create-store");
router.put("/update-store");
router.delete("/delete-store");

router.get("/payments");
router.post("/pay-bill");

export default router;
