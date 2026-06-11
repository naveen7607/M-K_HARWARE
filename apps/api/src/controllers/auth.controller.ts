import crypto from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import type { Request, Response } from "express";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { clearAuthCookies, createAuthTokens, setAuthCookies } from "../services/token.service.js";
import { sendPasswordResetEmail } from "../services/email.service.js";
import { sendOtp, verifyOtp } from "../services/otp.service.js";

function sanitizeUser(user: unknown) {
  return JSON.parse(JSON.stringify(user));
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const existing = await User.findOne({
    $or: [{ email: req.body.email }, { mobile: req.body.mobile }]
  });

  if (existing) {
    throw new ApiError(409, "A customer with this email or mobile already exists");
  }

  const user = await User.create(req.body);
  const tokens = createAuthTokens(user);
  setAuthCookies(res, tokens);

  return res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      user: sanitizeUser(user),
      ...tokens
    }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");

  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const tokens = createAuthTokens(user);
  setAuthCookies(res, tokens);

  return res.json({
    success: true,
    message: "Login successful",
    data: {
      user: sanitizeUser(user),
      ...tokens
    }
  });
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new ApiError(501, "Google login is not configured");
  }

  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: req.body.credential,
    audience: env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new ApiError(401, "Google profile does not include an email");
  }

  const user = await User.findOneAndUpdate(
    { email: payload.email.toLowerCase() },
    {
      $setOnInsert: {
        fullName: payload.name ?? payload.email.split("@")[0],
        mobile: req.body.mobile ?? `google-${payload.sub}`,
        provider: "google"
      },
      $set: {
        avatarUrl: payload.picture,
        isEmailVerified: Boolean(payload.email_verified),
        lastLoginAt: new Date()
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const tokens = createAuthTokens(user);
  setAuthCookies(res, tokens);

  return res.json({
    success: true,
    message: "Google login successful",
    data: {
      user,
      ...tokens
    }
  });
});

export const requestMobileOtp = asyncHandler(async (req: Request, res: Response) => {
  const result = await sendOtp(req.body.mobile);
  return res.json({
    success: true,
    data: result
  });
});

export const verifyMobileOtp = asyncHandler(async (req: Request, res: Response) => {
  await verifyOtp(req.body.mobile, req.body.code);

  const user = await User.findOneAndUpdate(
    { mobile: req.body.mobile },
    {
      isMobileVerified: true,
      provider: "otp",
      lastLoginAt: new Date()
    },
    { new: true }
  );

  if (!user) {
    return res.json({
      success: true,
      message: "Mobile verified. Please complete registration.",
      data: {
        requiresRegistration: true,
        mobile: req.body.mobile
      }
    });
  }

  const tokens = createAuthTokens(user);
  setAuthCookies(res, tokens);

  return res.json({
    success: true,
    message: "OTP login successful",
    data: {
      user,
      ...tokens
    }
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email }).select("+resetPasswordToken +resetPasswordExpires");

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(req.body.email, `${env.CLIENT_URL}/reset-password?token=${token}`);
  }

  return res.json({
    success: true,
    message: "If the email exists, a reset link has been sent"
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const tokenHash = crypto.createHash("sha256").update(req.body.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() }
  }).select("+password +resetPasswordToken +resetPasswordExpires");

  if (!user) {
    throw new ApiError(400, "Reset link is invalid or expired");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.json({
    success: true,
    message: "Password reset successful"
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.user!._id, req.body, {
    new: true,
    runValidators: true
  });

  return res.json({
    success: true,
    message: "Profile updated",
    data: {
      user
    }
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookies(res);
  return res.json({
    success: true,
    message: "Logged out"
  });
});
