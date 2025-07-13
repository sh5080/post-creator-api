import Joi from "joi";
import { BaseValidator } from "@common/validators/base.validator";
import { LoginDto } from "@auth/dto/auth.dto";

export interface CreateUserDto extends LoginDto {}

export class UserValidator extends BaseValidator<LoginDto> {
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

export class CreateUserValidator extends BaseValidator<CreateUserDto> {
  protected schema = Joi.object<CreateUserDto>({
    email: Joi.string().email().required().messages({
      "string.email": "유효한 이메일 형식이 아닙니다.",
      "any.required": "이메일은 필수 입력 항목입니다.",
    }),
    password: Joi.string().min(8).max(30).required().messages({
      "string.min": "비밀번호는 최소 8자 이상이어야 합니다.",
      "string.max": "비밀번호는 최대 30자 이하여야 합니다.",
      "any.required": "비밀번호는 필수 입력 항목입니다.",
    }),
  });
}

export const userValidator = new UserValidator();
export const createUserValidator = new CreateUserValidator();
