import { Router } from "express";
import * as controller from "../controller";
const router = Router();
router.get("/dashboard", controller.A_dashboard);
router.post("/set-up", controller.A_setUp);

router.get("/get-manager", controller.A_GetAllManager);
router.post("/crate-manager");
router.delete("/delete-manager");

router.get("/items", controller.A_GetItems);
router.post("/crate-item"); //
router.delete("/delete-item");
router.put("/update-item");

export default router;
