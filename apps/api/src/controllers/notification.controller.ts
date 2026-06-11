import type { Request, Response } from "express";
import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const filter =
    req.user?.role === "admin" || req.user?.role === "staff"
      ? {}
      : {
          recipient: req.user?._id
        };

  const items = await Notification.find(filter).sort({ createdAt: -1 }).limit(50).lean();

  return res.json({
    success: true,
    data: {
      items
    }
  });
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { readAt: new Date() },
    { new: true }
  );

  return res.json({
    success: true,
    data: {
      notification
    }
  });
});
