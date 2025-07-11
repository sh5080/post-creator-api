import Joi from "joi";
import { BlogPostRequest, CredentialRequest } from "../../types/request.type";
import { BadRequestException } from "../../types/response.type";

class InputValidator {
  private readonly schemas = {
    blogPost: Joi.object<BlogPostRequest>({
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
        .max(3)
        .default(1)
        .custom((value, helpers) => {
          return typeof value === "string" ? parseInt(value) : value;
        })
        .messages({
          "number.min": "키워드는 최소 1회 이상 포함되어야 합니다.",
          "number.max": "각 키워드는 최대 3회까지 포함될 수 있습니다.",
        }),
    }).required(),

    auth: Joi.object<CredentialRequest>({
      email: Joi.string().email().required().messages({
        "string.email": "유효한 이메일 형식이 아닙니다.",
        "any.required": "이메일은 필수 입력 항목입니다.",
      }),
      password: Joi.string().min(8).max(30).required().messages({
        "string.min": "비밀번호는 최소 8자 이상이어야 합니다.",
        "string.max": "비밀번호는 최대 30자 이하여야 합니다.",
        "any.required": "비밀번호는 필수 입력 항목입니다.",
      }),
    }).required(),
  };

  validate<T>(data: any, type: keyof typeof this.schemas): T {
    const schema = this.schemas[type];
    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new BadRequestException(
        `입력 유효성 검사 오류: ${error.details
          .map((d) => d.message)
          .join(", ")}`
      );
    }

    return value as T;
  }
}

// 싱글톤 인스턴스 생성
const validator = new InputValidator();

// 함수형 인터페이스들
export const validateBlogPostInput = (
  data: any
): Omit<BlogPostRequest, "imageKeys"> => {
  return validator.validate(data, "blogPost");
};

export const validateAuthInput = (data: any): CredentialRequest => {
  return validator.validate(data, "auth");
};
