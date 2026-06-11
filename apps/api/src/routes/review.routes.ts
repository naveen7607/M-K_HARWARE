import { Router } from "express";
import { approveReview, createReview, listReviews } from "../controllers/review.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  reviewApproveSchema,
  reviewCreateSchema,
  reviewListSchema
} from "../validators/review.validation.js";

const router = Router();

router.get("/", validate(reviewListSchema), listReviews);
router.post("/", validate(reviewCreateSchema), createReview);
router.patch("/:id/approval", authenticate, authorize("admin", "staff"), validate(reviewApproveSchema), approveReview);

export default router;
