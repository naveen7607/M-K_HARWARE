import type { Request, Response } from "express";
import type { SortOrder } from "mongoose";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { createLowStockNotification } from "../services/notification.service.js";

function getSort(sort: string): Record<string, SortOrder> {
  switch (sort) {
    case "price-asc":
      return { price: 1 };
    case "price-desc":
      return { price: -1 };
    case "stock-asc":
      return { stockQuantity: 1 };
    case "stock-desc":
      return { stockQuantity: -1 };
    default:
      return { createdAt: -1 };
  }
}

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, category, sort, featured } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = { isActive: true };

  if (category) filter.category = category;
  if (featured !== undefined) filter.isFeatured = featured === "true";
  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { brand: new RegExp(search, "i") },
      { sku: new RegExp(search, "i") },
      { description: new RegExp(search, "i") }
    ];
  }

  const numericPage = Number(page ?? 1);
  const numericLimit = Number(limit ?? 12);
  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(getSort(sort ?? "latest"))
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit)
      .lean(),
    Product.countDocuments(filter)
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

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true }).lean();

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.json({
    success: true,
    data: {
      product
    }
  });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.create(req.body);

  if (product.stockQuantity < product.lowStockThreshold) {
    await createLowStockNotification(product);
  }

  return res.status(201).json({
    success: true,
    message: "Product created",
    data: {
      product
    }
  });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.stockQuantity < product.lowStockThreshold) {
    await createLowStockNotification(product);
  }

  return res.json({
    success: true,
    message: "Product updated",
    data: {
      product
    }
  });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.json({
    success: true,
    message: "Product deleted"
  });
});

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();

  return res.json({
    success: true,
    data: {
      items: categories
    }
  });
});
