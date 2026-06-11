import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listCategories,
  listProducts,
  updateProduct
} from "../controllers/product.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  productCreateSchema,
  productListSchema,
  productParamSchema,
  productUpdateSchema
} from "../validators/product.validation.js";

const router = Router();

router.get("/categories", listCategories);
router.get("/", validate(productListSchema), listProducts);
router.get("/:id", validate(productParamSchema), getProduct);
router.post("/", authenticate, authorize("admin", "staff"), validate(productCreateSchema), createProduct);
router.patch("/:id", authenticate, authorize("admin", "staff"), validate(productUpdateSchema), updateProduct);
router.delete("/:id", authenticate, authorize("admin"), validate(productParamSchema), deleteProduct);

export default router;
