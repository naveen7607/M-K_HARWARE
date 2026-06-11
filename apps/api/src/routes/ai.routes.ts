import { Router } from "express";
import { chat, faqs, recommendations, smartSearch } from "../controllers/ai.controller.js";
import { validate } from "../middleware/validate.js";
import { aiChatSchema, recommendSchema } from "../validators/ai.validation.js";

const router = Router();

router.post("/chat", validate(aiChatSchema), chat);
router.post("/recommendations", validate(recommendSchema), recommendations);
router.get("/faqs", faqs);
router.get("/smart-search", smartSearch);

export default router;
