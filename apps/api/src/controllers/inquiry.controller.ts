import type { Request, Response } from "express";
import { Inquiry } from "../models/inquiry.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { sendInquiryConfirmation } from "../services/email.service.js";
import { createFollowUpNotification, createInquiryNotification } from "../services/notification.service.js";

export const createInquiry = asyncHandler(async (req: Request, res: Response) => {
  const productIds = req.body.items.map((item: { product: string }) => item.product);
  const count = await Product.countDocuments({ _id: { $in: productIds }, isActive: true });

  if (count !== productIds.length) {
    throw new ApiError(400, "One or more products are unavailable");
  }

  const inquiry = await Inquiry.create({
    ...req.body,
    customer: req.user?._id
  });

  await createInquiryNotification(inquiry._id.toString(), inquiry.customerName);

  if (inquiry.email) {
    await sendInquiryConfirmation(inquiry.email, inquiry.customerName, inquiry._id.toString());
  }

  if (inquiry.followUpAt) {
    await createFollowUpNotification(inquiry._id.toString(), inquiry.followUpAt);
  }

  return res.status(201).json({
    success: true,
    message: "Inquiry sent successfully",
    data: {
      inquiry
    }
  });
});

export const listInquiries = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "20", status } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};

  if (status) filter.status = status;

  if (req.user?.role === "customer") {
    filter.$or = [{ customer: req.user._id }, { phoneNumber: req.user.mobile }, { email: req.user.email }];
  }

  const numericPage = Number(page);
  const numericLimit = Number(limit);
  const [items, total] = await Promise.all([
    Inquiry.find(filter)
      .populate("items.product", "name imageUrl category brand price sku")
      .populate("assignedTo", "fullName role")
      .sort({ createdAt: -1 })
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit)
      .lean(),
    Inquiry.countDocuments(filter)
  ]);

  return res.json({
    success: true,
    data: {
      items,
      pagination: {
        page: numericPage,
        limit: numericLimit,
        total,
        pages: Math.ceil(total / numericLimit)
      }
    }
  });
});

export const updateInquiry = asyncHandler(async (req: Request, res: Response) => {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  if (req.body.followUpAt) {
    await createFollowUpNotification(inquiry._id.toString(), inquiry.followUpAt!);
  }

  return res.json({
    success: true,
    message: "Inquiry updated",
    data: {
      inquiry
    }
  });
});

export const deleteInquiry = asyncHandler(async (req: Request, res: Response) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  return res.json({
    success: true,
    message: "Inquiry deleted"
  });
});
