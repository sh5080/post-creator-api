import Joi from "joi";
import { BlogPostRequest } from "../../types/request.type";

const inputSchema = Joi.object<BlogPostRequest>({
  clientRequestPrompt: Joi.string().min(10).max(1000).required().messages({
    "string.min": "요청사항 프롬프트는 최소 10자 이상이어야 합니다.",
    "string.max": "요청사항 프롬프트는 최대 1000자 이하여야 합니다.",
  }),
  keywords: Joi.array()
    .items(Joi.string().min(2).max(50))
    .min(1)
    .max(5)
    .required()
    .messages({
      "array.min": "최소 1개 이상의 키워드가 필요합니다.",
      "array.max": "최대 5개의 키워드만 허용됩니다.",
    }),
  keywordCount: Joi.number().integer().min(1).max(3).required().messages({
    "number.min": "키워드는 최소 1회 이상 포함되어야 합니다.",
    "number.max": "각 키워드는 최대 3회까지 포함될 수 있습니다.",
  }),
}).required();

const validateInput = (data: any): Omit<BlogPostRequest, "imageKeys"> => {
  const { error, value } = inputSchema.validate(data, { abortEarly: false });
  if (error) {
    throw new Error(
      `입력 유효성 검사 오류: ${error.details.map((d) => d.message).join(", ")}`
    );
  }

  return value as BlogPostRequest;
};

export default validateInput;
