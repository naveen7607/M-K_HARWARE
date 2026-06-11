import mongoose, { Schema } from "mongoose";

export interface IOtpToken {
  _id: mongoose.Types.ObjectId;
  mobile: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  consumedAt?: Date;
}

const otpTokenSchema = new Schema<IOtpToken>(
  {
    mobile: {
      type: String,
      required: true,
      index: true
    },
    codeHash: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    },
    attempts: {
      type: Number,
      default: 0
    },
    consumedAt: Date
  },
  { timestamps: true }
);

export const OtpToken = mongoose.model<IOtpToken>("OtpToken", otpTokenSchema);
