import mongoose, { Schema } from "mongoose";

export interface IReview {
  _id: mongoose.Types.ObjectId;
  customer?: mongoose.Types.ObjectId;
  product?: mongoose.Types.ObjectId;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
}

const reviewSchema = new Schema<IReview>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      index: true
    },
    customerName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: 800
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>("Review", reviewSchema);
