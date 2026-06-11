import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { Response } from "express";
import type { IUser } from "../models/user.model.js";
import { env, isProduction } from "../config/env.js";

type TokenPayload = {
  sub: string;
  role: IUser["role"];
  email: string;
};

function signToken(payload: TokenPayload, secret: Secret, expiresIn: SignOptions["expiresIn"]) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function createAuthTokens(user: IUser) {
  const payload: TokenPayload = {
    sub: user._id.toString(),
    role: user.role,
    email: user.email
  };

  return {
    accessToken: signToken(payload, env.JWT_ACCESS_SECRET, env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]),
    refreshToken: signToken(payload, env.JWT_REFRESH_SECRET, env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"])
  };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function setAuthCookies(res: Response, tokens: ReturnType<typeof createAuthTokens>) {
  res.cookie("manikyam_access", tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 15 * 60 * 1000,
    path: "/",
    domain: isProduction ? env.COOKIE_DOMAIN : undefined
  });

  res.cookie("manikyam_refresh", tokens.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    domain: isProduction ? env.COOKIE_DOMAIN : undefined
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("manikyam_access", { path: "/" });
  res.clearCookie("manikyam_refresh", { path: "/" });
}
