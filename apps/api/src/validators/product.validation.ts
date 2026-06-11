import { z } from "zod";
import { productCategoryNames } from "../models/category.model.js";
import { objectIdSchema, paginationQuerySchema } from "./common.js";

export const productCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(180),
    imageUrl: z.string().url(),
    category: z.enum(productCategoryNames),
    brand: z.string().min(1).max(120),
    stockQuantity: z.coerce.number().int().min(0),
    price: z.coerce.number().min(0),
    description: z.string().min(10).max(2000),
    sku: z.string().min(3).max(60),
    specifications: z.record(z.string()).default({}),
    isFeatured: z.boolean().default(false),
    lowStockThreshold: z.coerce.number().int().min(1).default(10)
  })
});

export const productUpdateSchema = productCreateSchema.deepPartial().extend({
  params: z.object({
    id: objectIdSchema
  })
});

export const productListSchema = z.object({
  query: paginationQuerySchema.extend({
    search: z.string().optional(),
    category: z.enum(productCategoryNames).optional(),
    sort: z.enum(["latest", "price-asc", "price-desc", "stock-asc", "stock-desc"]).default("latest"),
    featured: z.coerce.boolean().optional()
  })
});

export const productParamSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});
