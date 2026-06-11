import mongoose, { Schema } from "mongoose";

export const inventoryReasons = ["purchase", "sale", "adjustment", "return", "damage"] as const;
export type InventoryReason = (typeof inventoryReasons)[number];

export interface IInventory {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  sku: string;
  change: number;
  previousStock: number;
  newStock: number;
  reason: InventoryReason;
  note?: string;
  performedBy?: mongoose.Types.ObjectId;
}

const inventorySchema = new Schema<IInventory>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },
    sku: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    change: {
      type: Number,
      required: true
    },
    previousStock: {
      type: Number,
      required: true,
      min: 0
    },
    newStock: {
      type: Number,
      required: true,
      min: 0
    },
    reason: {
      type: String,
      enum: inventoryReasons,
      required: true
    },
    note: String,
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export const Inventory = mongoose.model<IInventory>("Inventory", inventorySchema);
