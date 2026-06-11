import { z } from "zod";
import { objectIdSchema, paginationQuerySchema } from "./common.js";

export const reviewCreateSchema = z.object({
  body: z.object({
    product: objectIdSchema.optional(),
    customerName: z.string().min(2).max(120),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(5).max(800)
  })
});

export const reviewListSchema = z.object({
  query: paginationQuerySchema.extend({
    product: objectIdSchema.optional()
  })
});

export const reviewApproveSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    isApproved: z.boolean()
  })
});
