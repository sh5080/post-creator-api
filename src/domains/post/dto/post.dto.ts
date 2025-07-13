import Joi from "joi";
import { BaseValidator } from "@common/validators/base.validator";

export interface CreatePostDto {
  clientRequestPrompt: string;
  keywords: string[];
  keywordCount: number;
}

export class CreatePostValidator extends BaseValidator<CreatePostDto> {
  protected schema = Joi.object<CreatePostDto>({
    clientRequestPrompt: Joi.string().min(10).max(1000).required().messages({
      "string.min": "요청사항 프롬프트는 최소 10자 이상이어야 합니다.",
      "string.max": "요청사항 프롬프트는 최대 1000자 이하여야 합니다.",
      "any.required": "요청사항 프롬프트는 필수입니다.",
    }),
    keywords: Joi.array()
      .items(Joi.string().min(2).max(50))
      .min(1)
      .max(5)
      .messages({
        "array.min": "최소 1개 이상의 키워드가 필요합니다.",
        "array.max": "최대 5개의 키워드만 허용됩니다.",
        "array.base": "keywords는 배열 형식이어야 합니다.",
        "string.min": "각 키워드는 최소 2자 이상이어야 합니다.",
        "string.max": "각 키워드는 최대 50자까지 허용됩니다.",
      }),
    keywordCount: Joi.number()
      .integer()
      .min(1)
      .max(10)
      .default(1)
      .custom((value, helpers) => {
        return typeof value === "string" ? parseInt(value) : value;
      })
      .messages({
        "number.min": "키워드는 최소 1회 이상 포함되어야 합니다.",
        "number.max": "각 키워드는 최대 10회까지 포함될 수 있습니다.",
      }),
  });
}

export const createPostValidator = new CreatePostValidator();
