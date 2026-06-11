import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";
import { isProduction } from "../config/env.js";

export const notFoundHandler = () => {
  throw new ApiError(404, "API route not found");
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten()
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Something went wrong",
    stack: isProduction ? undefined : error?.stack
  });
};
