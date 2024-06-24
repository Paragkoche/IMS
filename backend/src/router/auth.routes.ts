import { Router } from "express";
import * as controller from "../controller";
import { checkAuth } from "../helper/auth";
const router = Router();

router.post("/login", controller.UserLogin);
router.post("/register", controller.UserRegister);
router.post("/log-out", controller.UserLogOut);
router.put("/ref-token", checkAuth, controller.refToken);
export default router;
