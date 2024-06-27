import { Router } from "express";
import * as controller from "../controller";
const router = Router();

router.get("/dashboard", controller.SP_dashboard);

router.get("/admins", controller.SP_GetAllAdmins);
router.post("/create-admin", controller.SP_CreateAdmin);
router.put("/update-admin", controller.SP_updateAdmin);
router.delete("/delete-admin", controller.SP_deleteAdmin);

router.get("/stores", controller.SP_GetAllStores);
router.post("/create-store");
router.put("/update-store");
router.delete("/delete-store");

router.get("/payments");
router.post("/pay-bill");

export default router;
