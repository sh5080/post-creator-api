import mongoose, { Schema, Document } from "mongoose";

export const USER_ROLE = {
  ADMIN: "admin",
  USER: "user",
} as const;

interface IUser extends Document {
  email: string;
  password: string;
  role: (typeof USER_ROLE)[keyof typeof USER_ROLE];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [USER_ROLE.ADMIN, USER_ROLE.USER],
      default: USER_ROLE.USER,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 이메일 검색을 위한 인덱스
UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
export type { IUser };
