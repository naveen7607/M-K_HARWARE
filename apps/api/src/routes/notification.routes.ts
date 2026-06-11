import { Router } from "express";
import { listNotifications, markNotificationRead } from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);
router.get("/", listNotifications);
router.patch("/:id/read", markNotificationRead);

export default router;
