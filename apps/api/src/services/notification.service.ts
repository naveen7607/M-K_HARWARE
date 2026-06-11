import { Notification } from "../models/notification.model.js";
import type { IProduct } from "../models/product.model.js";

export async function createLowStockNotification(product: IProduct) {
  return Notification.create({
    type: "low_stock",
    title: "Low Stock Warning",
    message: `${product.name} stock is below ${product.lowStockThreshold}. Current stock: ${product.stockQuantity}.`,
    metadata: {
      productId: product._id,
      sku: product.sku,
      stockQuantity: product.stockQuantity
    }
  });
}

export async function createInquiryNotification(inquiryId: string, customerName: string) {
  return Notification.create({
    type: "inquiry",
    title: "New customer inquiry",
    message: `${customerName} sent a product inquiry.`,
    metadata: {
      inquiryId
    }
  });
}

export async function createFollowUpNotification(inquiryId: string, followUpAt: Date) {
  return Notification.create({
    type: "follow_up",
    title: "Customer follow-up reminder",
    message: `Follow up for inquiry ${inquiryId} on ${followUpAt.toLocaleDateString("en-IN")}.`,
    metadata: {
      inquiryId,
      followUpAt
    }
  });
}
