import { Router } from "express";
import * as Controller from "../controller";
const router = Router();

router.get("/dashboard", Controller.M_Dashboard);

router.post("/set-up", Controller.M_setUp);

router.get("/delivery-partner", Controller.M_createDeliveryPartner);

//============================HW==========================
router.post("/create-delivery-partner");
router.delete("/delete-delivery-partner");

router.get("/store-manager");
router.post("/create-store-manager");
router.delete("/delete-store-manager");
router.put("/order-assign");

router.get("/store");
router.post("/create-store");
router.delete("/delete-store");

router.get("/vendor");
router.post("/create-vendor");
router.delete("/delete-vendor");
//=============================HW============================
