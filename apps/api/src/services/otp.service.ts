import bcrypt from "bcryptjs";
import twilio from "twilio";
import { env } from "../config/env.js";
import { OtpToken } from "../models/otp-token.model.js";
import { ApiError } from "../utils/api-error.js";

const OTP_EXPIRY_MINUTES = 5;

function hasTwilioVerifyConfig() {
  return Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_VERIFY_SERVICE_SID);
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtp(mobile: string) {
  if (hasTwilioVerifyConfig()) {
    const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    await client.verify.v2
      .services(env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({ to: mobile, channel: "sms" });

    return {
      message: "OTP sent successfully",
      expiresInSeconds: OTP_EXPIRY_MINUTES * 60
    };
  }

  const code = generateOtp();
  await OtpToken.deleteMany({ mobile, consumedAt: { $exists: false } });
  await OtpToken.create({
    mobile,
    codeHash: await bcrypt.hash(code, 10),
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
  });

  console.log(`Development OTP for ${mobile}: ${code}`);

  return {
    message: "Development OTP generated. Configure Twilio for real SMS delivery.",
    expiresInSeconds: OTP_EXPIRY_MINUTES * 60
  };
}

export async function verifyOtp(mobile: string, code: string) {
  if (hasTwilioVerifyConfig()) {
    const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    const result = await client.verify.v2
      .services(env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({ to: mobile, code });

    if (result.status !== "approved") {
      throw new ApiError(401, "Invalid OTP");
    }

    return true;
  }

  const token = await OtpToken.findOne({
    mobile,
    consumedAt: { $exists: false },
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });

  if (!token) {
    throw new ApiError(401, "OTP expired or not found");
  }

  if (token.attempts >= 5) {
    throw new ApiError(429, "Too many OTP attempts. Please request a new code.");
  }

  const valid = await bcrypt.compare(code, token.codeHash);
  token.attempts += 1;

  if (!valid) {
    await token.save();
    throw new ApiError(401, "Invalid OTP");
  }

  token.consumedAt = new Date();
  await token.save();
  return true;
}
