import Joi from "joi";
import { BaseValidator } from "@common/validators/base.validator";

export interface LoginDto {
  email: string;
  password: string;
}

export class AuthValidator extends BaseValidator<LoginDto> {
  protected schema = Joi.object<LoginDto>({
    email: Joi.string().email().required().messages({
      "string.email": "유효한 이메일 형식이 아닙니다.",
      "any.required": "이메일은 필수 입력 항목입니다.",
    }),
    password: Joi.string().min(8).max(20).required().messages({
      "string.min": "비밀번호는 최소 8자 이상이어야 합니다.",
      "string.max": "비밀번호는 최대 20자 이하여야 합니다.",
      "any.required": "비밀번호는 필수 입력 항목입니다.",
    }),
  });
}

export const authValidator = new AuthValidator();
