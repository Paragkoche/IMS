import { Router } from "express";
import * as controller from "../controller";
const router = Router();

router.get("/dashboard", controller.A_dashboard);
router.post("set-up", controller.A_setUp);

router.get("/get-manager", controller.A_getAllManagers);
router.post("/create-manager", controller.A_createManager);
router.delete("/delete-manager", controller.A_deleteManager);

router.get("/items", controller.A_getAllItems);
router.post("/create-item", controller.A_CreateItem);
router.put("/update-item", controller.A_UpdateItem); // H.W
router.delete("/delete-item", controller.A_deleteItem); // H.W

export default router;
