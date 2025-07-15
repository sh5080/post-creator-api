import mongoose, { Schema, Document, Types } from "mongoose";

export const USER_ROLE = {
  ADMIN: "admin",
  USER: "user",
} as const;

interface IUser extends Document {
  _id: Types.ObjectId;
  nickname: string;
  email: string;
  password: string;
  role: (typeof USER_ROLE)[keyof typeof USER_ROLE];
  favoriteTemplates: Types.ObjectId[]; // 즐겨찾기한 템플릿 목록
  defaultTemplateId?: Types.ObjectId; // 기본 템플릿 (optional)
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    nickname: {
      type: String,
      required: true,
    },
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
    favoriteTemplates: [
      {
        type: Schema.Types.ObjectId,
        ref: "PostTemplate",
      },
    ],
    defaultTemplateId: {
      type: Schema.Types.ObjectId,
      ref: "PostTemplate",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// 이메일 검색을 위한 인덱스
UserSchema.index({ email: 1 });

// 즐겨찾기 추가 메서드
UserSchema.methods.addFavoriteTemplate = async function (
  templateId: Types.ObjectId
) {
  if (!this.favoriteTemplates.includes(templateId)) {
    this.favoriteTemplates.push(templateId);
    await this.save();

    // 템플릿의 즐겨찾기 카운트 증가
    await mongoose
      .model("PostTemplate")
      .findByIdAndUpdate(templateId, { $inc: { favoriteCount: 1 } });
  }
};

// 즐겨찾기 제거 메서드
UserSchema.methods.removeFavoriteTemplate = async function (
  templateId: Types.ObjectId
) {
  const index = this.favoriteTemplates.indexOf(templateId);
  if (index > -1) {
    this.favoriteTemplates.splice(index, 1);
    await this.save();

    // 템플릿의 즐겨찾기 카운트 감소
    await mongoose
      .model("PostTemplate")
      .findByIdAndUpdate(templateId, { $inc: { favoriteCount: -1 } });
  }
};

// 기본 템플릿 설정 메서드
UserSchema.methods.setDefaultTemplate = async function (
  templateId: Types.ObjectId
) {
  const exists = this.favoriteTemplates.includes(templateId);
  if (!exists) {
    throw new Error("Template not found in favorites");
  }

  this.defaultTemplateId = templateId;
  await this.save();
  return templateId;
};

export const User = mongoose.model<IUser>("User", UserSchema);
export type { IUser };
