import { Router } from "express";

const router = Router();

router.get("/dashboard");

router.get("delivery-partner");
router.post("/create-delivery-partner");
router.delete("/delete-delivery-partner");

router.get("/store-manager");
router.post("/create-store-manager");
router.delete("/delete-store-manager");

router.get("/vendor");
router.post("/create-vendor");
router.delete("/delete-vendor");
