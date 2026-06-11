import { Router } from "express";
import {
  forgotPassword,
  getProfile,
  googleLogin,
  login,
  logout,
  register,
  requestMobileOtp,
  resetPassword,
  updateProfile,
  verifyMobileOtp
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  registerSchema,
  requestOtpSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyOtpSchema
} from "../validators/auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google", validate(googleLoginSchema), googleLogin);
router.post("/otp/request", validate(requestOtpSchema), requestMobileOtp);
router.post("/otp/verify", validate(verifyOtpSchema), verifyMobileOtp);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, validate(updateProfileSchema), updateProfile);
router.post("/logout", authenticate, logout);

export default router;
