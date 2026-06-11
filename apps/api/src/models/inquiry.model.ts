import mongoose, { Schema } from "mongoose";

export const inquiryStatuses = ["new", "contacted", "quoted", "converted", "closed"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];

export interface IInquiryItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  targetPrice?: number;
}

export interface IInquiry {
  _id: mongoose.Types.ObjectId;
  customer?: mongoose.Types.ObjectId;
  customerName: string;
  phoneNumber: string;
  email?: string;
  items: IInquiryItem[];
  message?: string;
  status: InquiryStatus;
  assignedTo?: mongoose.Types.ObjectId;
  followUpAt?: Date;
  notes?: string;
}

const inquiryItemSchema = new Schema<IInquiryItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      min: 1,
      required: true
    },
    targetPrice: {
      type: Number,
      min: 0
    }
  },
  { _id: false }
);

const inquirySchema = new Schema<IInquiry>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    items: {
      type: [inquiryItemSchema],
      validate: [(items: IInquiryItem[]) => items.length > 0, "At least one product is required"]
    },
    message: String,
    status: {
      type: String,
      enum: inquiryStatuses,
      default: "new",
      index: true
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    followUpAt: Date,
    notes: String
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model<IInquiry>("Inquiry", inquirySchema);
