import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import aiRoutes from "./ai.routes.js";
import authRoutes from "./auth.routes.js";
import inquiryRoutes from "./inquiry.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import notificationRoutes from "./notification.routes.js";
import productRoutes from "./product.routes.js";
import reviewRoutes from "./review.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/admin", adminRoutes);
router.use("/ai", aiRoutes);
router.use("/reviews", reviewRoutes);
router.use("/notifications", notificationRoutes);

export default router;
