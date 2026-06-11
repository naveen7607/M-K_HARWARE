import { Router } from "express";
import {
  createInquiry,
  deleteInquiry,
  listInquiries,
  updateInquiry
} from "../controllers/inquiry.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  inquiryCreateSchema,
  inquiryListSchema,
  inquiryParamSchema,
  inquiryUpdateSchema
} from "../validators/inquiry.validation.js";

const router = Router();

router.post("/", validate(inquiryCreateSchema), createInquiry);
router.get("/", authenticate, validate(inquiryListSchema), listInquiries);
router.patch("/:id", authenticate, authorize("admin", "staff"), validate(inquiryUpdateSchema), updateInquiry);
router.delete("/:id", authenticate, authorize("admin"), validate(inquiryParamSchema), deleteInquiry);

export default router;
