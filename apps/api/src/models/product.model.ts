import mongoose, { Schema } from "mongoose";
import { productCategoryNames, type ProductCategoryName } from "./category.model.js";

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  imageUrl: string;
  category: ProductCategoryName;
  brand: string;
  stockQuantity: number;
  price: number;
  description: string;
  sku: string;
  specifications: Record<string, string>;
  isFeatured: boolean;
  isActive: boolean;
  lowStockThreshold: number;
  ratingAverage: number;
  ratingCount: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: "text",
      maxlength: 180
    },
    imageUrl: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: productCategoryNames,
      required: true,
      index: true
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000
    },
    sku: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      trim: true,
      index: true
    },
    specifications: {
      type: Map,
      of: String,
      default: {}
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    ratingAverage: {
      type: Number,
      default: 0
    },
    ratingCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

productSchema.index({
  name: "text",
  brand: "text",
  description: "text",
  sku: "text"
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
