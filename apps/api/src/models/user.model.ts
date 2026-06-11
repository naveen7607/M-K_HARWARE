import bcrypt from "bcryptjs";
import mongoose, { type HydratedDocument, Schema } from "mongoose";

export const roles = ["customer", "staff", "admin"] as const;
export type UserRole = (typeof roles)[number];

export interface IUser {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  mobile: string;
  email: string;
  password?: string;
  role: UserRole;
  avatarUrl?: string;
  provider: "email" | "google" | "otp";
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  wishlist: mongoose.Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLoginAt?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: roles,
      default: "customer",
      index: true
    },
    avatarUrl: String,
    provider: {
      type: String,
      enum: ["email", "google", "otp"],
      default: "email"
    },
    isMobileVerified: {
      type: Boolean,
      default: false
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpires: {
      type: Date,
      select: false
    },
    lastLoginAt: Date
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        return ret;
      }
    }
  }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = async function comparePassword(this: HydratedDocument<IUser>, candidate: string) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
