import { Router } from "express";
import * as Controller from "../controller";
const router = Router();

router.get("/dashboard", Controller.SM_Dashboard);

router.post("/set-up", Controller.SM_setUp);

router.post("/req-order", Controller.SM_reqOrder);

router.get("/items", Controller.SM_getAllItems);

export default router;
