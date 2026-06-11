import type { Request, Response } from "express";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.create({
    ...req.body,
    customer: req.user?._id
  });

  return res.status(201).json({
    success: true,
    message: "Review submitted for approval",
    data: {
      review
    }
  });
});

export const listReviews = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", product } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = { isApproved: true };

  if (product) filter.product = product;

  const numericPage = Number(page);
  const numericLimit = Number(limit);
  const [items, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit)
      .lean(),
    Review.countDocuments(filter)
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

export const approveReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: req.body.isApproved },
    { new: true, runValidators: true }
  );

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.product && review.isApproved) {
    const stats = await Review.aggregate([
      { $match: { product: review.product, isApproved: true } },
      { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    await Product.findByIdAndUpdate(review.product, {
      ratingAverage: stats[0]?.avg ?? 0,
      ratingCount: stats[0]?.count ?? 0
    });
  }

  return res.json({
    success: true,
    message: "Review updated",
    data: {
      review
    }
  });
});
