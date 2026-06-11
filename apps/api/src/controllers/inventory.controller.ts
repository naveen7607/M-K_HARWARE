import type { Request, Response } from "express";
import { Inventory } from "../models/inventory.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { createLowStockNotification } from "../services/notification.service.js";

export const listInventoryMovements = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "20", productId, sku } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};

  if (productId) filter.product = productId;
  if (sku) filter.sku = sku.toUpperCase();

  const numericPage = Number(page);
  const numericLimit = Number(limit);
  const [items, total] = await Promise.all([
    Inventory.find(filter)
      .populate("product", "name imageUrl category brand")
      .populate("performedBy", "fullName role")
      .sort({ createdAt: -1 })
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit)
      .lean(),
    Inventory.countDocuments(filter)
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

export const adjustInventory = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.body.productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const previousStock = product.stockQuantity;
  const newStock = previousStock + req.body.change;

  if (newStock < 0) {
    throw new ApiError(400, "Stock cannot be reduced below zero");
  }

  product.stockQuantity = newStock;
  await product.save();

  const movement = await Inventory.create({
    product: product._id,
    sku: product.sku,
    change: req.body.change,
    previousStock,
    newStock,
    reason: req.body.reason,
    note: req.body.note,
    performedBy: req.user?._id
  });

  if (product.stockQuantity < product.lowStockThreshold) {
    await createLowStockNotification(product);
  }

  return res.status(201).json({
    success: true,
    message: "Inventory updated",
    data: {
      product,
      movement
    }
  });
});

export const listLowStockProducts = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Product.find({
    isActive: true,
    $expr: { $lt: ["$stockQuantity", "$lowStockThreshold"] }
  })
    .sort({ stockQuantity: 1 })
    .lean();

  return res.json({
    success: true,
    data: {
      items
    }
  });
});
