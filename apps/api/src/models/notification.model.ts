import mongoose, { Schema } from "mongoose";

export const notificationTypes = ["inquiry", "low_stock", "follow_up", "system"] as const;

export interface INotification {
  _id: mongoose.Types.ObjectId;
  recipient?: mongoose.Types.ObjectId;
  type: (typeof notificationTypes)[number];
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  readAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    type: {
      type: String,
      enum: notificationTypes,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    metadata: {
      type: Schema.Types.Mixed
    },
    readAt: Date
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
