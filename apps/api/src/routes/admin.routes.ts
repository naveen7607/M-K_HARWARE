import { Router } from "express";
import { getDashboardAnalytics } from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, authorize("admin", "staff"));
router.get("/analytics", getDashboardAnalytics);

export default router;
