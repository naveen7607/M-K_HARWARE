import type { Request, Response } from "express";
import { answerCustomerQuestion, generateFaqs, recommendProducts } from "../services/ai.service.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const chat = asyncHandler(async (req: Request, res: Response) => {
  const result = await answerCustomerQuestion(req.body.message);

  return res.json({
    success: true,
    data: result
  });
});

export const recommendations = asyncHandler(async (req: Request, res: Response) => {
  const items = await recommendProducts(req.body.query);

  return res.json({
    success: true,
    data: {
      items
    }
  });
});

export const faqs = asyncHandler(async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      items: await generateFaqs()
    }
  });
});

export const smartSearch = asyncHandler(async (req: Request, res: Response) => {
  const query = String(req.query.q ?? "");
  const items = query
    ? await Product.find({
        isActive: true,
        $or: [
          { name: new RegExp(query, "i") },
          { brand: new RegExp(query, "i") },
          { category: new RegExp(query, "i") },
          { description: new RegExp(query, "i") }
        ]
      })
        .select("name imageUrl category brand price stockQuantity sku")
        .limit(10)
        .lean()
    : [];

  return res.json({
    success: true,
    data: {
      items
    }
  });
});
