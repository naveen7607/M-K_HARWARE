import mongoose, { Schema } from "mongoose";

export const productCategoryNames = ["Hardware", "Electrical", "Cement", "Agriculture"] as const;
export type ProductCategoryName = (typeof productCategoryNames)[number];

export interface ICategory {
  _id: mongoose.Types.ObjectId;
  name: ProductCategoryName;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      enum: productCategoryNames,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: String,
    imageUrl: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);
