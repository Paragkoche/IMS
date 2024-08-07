import { Router } from "express";
import AuthRoute from "./auth.routes";
import { checkAuth } from "../helper/auth";
import SuperAdminRoutes from "./superUser.routes";
import AdminRoutes from "./admin.routes";
const router = Router();

router.use("/auth", AuthRoute);
router.use("/super-admin", checkAuth, SuperAdminRoutes);
router.use("/admin", checkAuth, AdminRoutes);
// router.use("/end-users", checkAuth);
router.use("/admin", checkAuth, AdminRoutes);
// router.use("/store-manager", checkAuth);
// router.use("/vendor", checkAuth);
// router.use("/managers", checkAuth);
// router.use("/developer");

export default router;
