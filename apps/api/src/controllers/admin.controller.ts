import type { Request, Response } from "express";
import { Inquiry } from "../models/inquiry.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getDashboardAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalCustomers,
    totalProducts,
    totalInquiries,
    monthlyInquiries,
    lowStockProducts,
    categoryChart,
    customerGrowth,
    revenueRows,
    salesChart
  ] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    Product.countDocuments({ isActive: true }),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ createdAt: { $gte: monthStart } }),
    Product.find({
      isActive: true,
      $expr: { $lt: ["$stockQuantity", "$lowStockThreshold"] }
    })
      .select("name sku stockQuantity lowStockThreshold")
      .sort({ stockQuantity: 1 })
      .limit(10)
      .lean(),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", value: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", value: 1 } },
      { $sort: { name: 1 } }
    ]),
    User.aggregate([
      { $match: { role: "customer", createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          customers: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]),
    Inquiry.aggregate([
      { $match: { status: "converted" } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $multiply: ["$items.quantity", "$product.price"] } }
        }
      }
    ]),
    Inquiry.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          inquiries: { $sum: 1 },
          converted: { $sum: { $cond: [{ $eq: ["$status", "converted"] }, 1, 0] } }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ])
  ]);

  return res.json({
    success: true,
    data: {
      cards: {
        totalCustomers,
        totalProducts,
        totalInquiries,
        monthlySales: monthlyInquiries,
        revenue: revenueRows[0]?.revenue ?? 0
      },
      charts: {
        categoryChart,
        customerGrowth: customerGrowth.map((row) => ({
          month: `${row._id.month}/${row._id.year}`,
          customers: row.customers
        })),
        salesChart: salesChart.map((row) => ({
          month: `${row._id.month}/${row._id.year}`,
          inquiries: row.inquiries,
          converted: row.converted
        }))
      },
      lowStockProducts
    }
  });
});
