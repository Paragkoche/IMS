import { Router } from "express";
import * as controller from "../controller"
const router = Router()

router.post("/login", controller.UserLogin);
router.post("/register", controller.UserRegister);
router.post("/log-out", controller.UserLogOut);

export default router