import { z } from "zod";
import { inquiryStatuses } from "../models/inquiry.model.js";
import { objectIdSchema, paginationQuerySchema } from "./common.js";

export const inquiryCreateSchema = z.object({
  body: z.object({
    customerName: z.string().min(2).max(120),
    phoneNumber: z.string().min(10).max(16),
    email: z.string().email().optional(),
    items: z
      .array(
        z.object({
          product: objectIdSchema,
          productName: z.string().min(2),
          quantity: z.coerce.number().int().min(1),
          targetPrice: z.coerce.number().min(0).optional()
        })
      )
      .min(1),
    message: z.string().max(1000).optional(),
    followUpAt: z.coerce.date().optional()
  })
});

export const inquiryListSchema = z.object({
  query: paginationQuerySchema.extend({
    status: z.enum(inquiryStatuses).optional()
  })
});

export const inquiryUpdateSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    status: z.enum(inquiryStatuses).optional(),
    notes: z.string().max(2000).optional(),
    followUpAt: z.coerce.date().optional(),
    assignedTo: objectIdSchema.optional()
  })
});

export const inquiryParamSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});
