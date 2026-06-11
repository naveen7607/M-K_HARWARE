import { Router } from "express";
import {
  adjustInventory,
  listInventoryMovements,
  listLowStockProducts
} from "../controllers/inventory.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { inventoryAdjustSchema, inventoryListSchema } from "../validators/inventory.validation.js";

const router = Router();

router.use(authenticate, authorize("admin", "staff"));
router.get("/", validate(inventoryListSchema), listInventoryMovements);
router.get("/low-stock", listLowStockProducts);
router.post("/adjust", validate(inventoryAdjustSchema), adjustInventory);

export default router;
