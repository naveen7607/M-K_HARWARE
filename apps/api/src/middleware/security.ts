import cookieParser from "cookie-parser";
import cors from "cors";
import type { Express } from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { doubleCsrf } from "csrf-csrf";
import { env, isProduction } from "../config/env.js";

export const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: () => env.JWT_REFRESH_SECRET,
  cookieName: "__Host-manikyam.csrf",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProduction
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"]
});

export function registerSecurityMiddleware(app: Express) {
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true
    })
  );
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use(morgan(isProduction ? "combined" : "dev"));
}
