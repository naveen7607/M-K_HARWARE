import { z } from "zod";
import { inventoryReasons } from "../models/inventory.model.js";
import { objectIdSchema, paginationQuerySchema } from "./common.js";

export const inventoryAdjustSchema = z.object({
  body: z.object({
    productId: objectIdSchema,
    change: z.coerce.number().int(),
    reason: z.enum(inventoryReasons),
    note: z.string().max(800).optional()
  })
});

export const inventoryListSchema = z.object({
  query: paginationQuerySchema.extend({
    productId: objectIdSchema.optional(),
    sku: z.string().optional()
  })
});
