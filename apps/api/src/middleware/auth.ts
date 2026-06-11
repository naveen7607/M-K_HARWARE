import type { NextFunction, Request, Response } from "express";
import { User, type UserRole } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { verifyAccessToken } from "../services/token.service.js";

function extractBearerToken(req: Request) {
  const authorization = req.headers.authorization;
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice(7);
  }

  return req.cookies?.manikyam_access as string | undefined;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    req.user = user;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired session"));
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }

    return next();
  };
}
