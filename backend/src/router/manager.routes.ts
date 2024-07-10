import { Router } from "express";
import * as Controller from "../controller";
const router = Router();

router.get("/dashboard", Controller.M_Dashboard);

router.post("/set-up", Controller.M_setUp);

router.get("/delivery-partner", Controller.M_getAllDeliveryPartners);

//============================HW==========================
router.post("/create-delivery-partner", Controller.M_createDeliveryPartner);
router.delete("/delete-delivery-partner", Controller.M_deleteDeliveryPartners);

router.get("/store-manager", Controller.M_getAllStoreManagers);
router.post("/create-store-manager", Controller.M_createStoreManager);
router.delete("/delete-store-manager", Controller.M_deleteStoreManager);
router.put("/order-assign", Controller.M_updateAssignedOrder);

router.get("/store", Controller.M_getAllStores);
router.post("/create-store", Controller.M_createStore);
router.delete("/delete-store", Controller.M_deleteStore);

router.get("/vendor", Controller.M_getAllVendors);
router.post("/create-vendor", Controller.M_createVendor);
router.delete("/delete-vendor", Controller.M_deleteVendor);
//=============================HW============================
