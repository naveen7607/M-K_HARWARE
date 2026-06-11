import express from "express";
import apiRoutes from "./routes/index.js";
import { env, isProduction } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { doubleCsrfProtection, generateToken, registerSecurityMiddleware } from "./middleware/security.js";

export function createApp() {
  const app = express();

  registerSecurityMiddleware(app);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      service: "manikyam-api",
      status: "healthy",
      timestamp: new Date().toISOString()
    });
  });

  app.get("/api/security/csrf-token", (req, res) => {
    res.json({
      success: true,
      data: {
        csrfToken: generateToken(req, res)
      }
    });
  });

  if (isProduction) {
    app.use(doubleCsrfProtection);
  }

  app.use("/api", apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const clientUrl = env.CLIENT_URL;
