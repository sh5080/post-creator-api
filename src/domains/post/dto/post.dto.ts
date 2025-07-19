import Joi from "joi";
import { BaseValidator } from "@common/validators/base.validator";
import { POST_CATEGORY } from "@common/models/post.model";
import { PaginationQuery } from "@common/types/request.type";
import {
  commonPaginationSchema,
  PaginationValidator,
} from "@common/validators/pagination.validator";

// Post 관련 DTO
export interface CreatePostDto {
  title: string;
  postCategory: (typeof POST_CATEGORY)[keyof typeof POST_CATEGORY];
  clientRequestPrompt: string;
  keywords: string[];
  keywordCount: number;
}

// Template 관련 DTO
export interface CreateTemplateDto {
  name: string;
  content: string;
  category: (typeof POST_CATEGORY)[keyof typeof POST_CATEGORY];
  isPublic: boolean;
}

// 페이지네이션을 포함한 템플릿 조회 DTO
export interface GetPublicTemplatesDto extends PaginationQuery {
  category?: (typeof POST_CATEGORY)[keyof typeof POST_CATEGORY];
  sort?: "latest" | "popular";
}

// 내가 생성한 템플릿 조회 DTO
export interface GetMyTemplatesDto extends PaginationQuery {
  sort?: "latest" | "popular";
}

// 내가 즐겨찾기한 템플릿 조회 DTO
export interface GetMyFavoriteTemplatesDto extends PaginationQuery {
  sort?: "latest" | "popular";
}

// Post Validator
export class CreatePostValidator extends BaseValidator<CreatePostDto> {
  protected schema = Joi.object<CreatePostDto>({
    title: Joi.string().min(1).max(100).required().messages({
      "string.min": "제목은 최소 1자 이상이어야 합니다.",
      "string.max": "제목은 최대 100자 이하여야 합니다.",
      "any.required": "제목은 필수입니다.",
    }),
    postCategory: Joi.string()
      .valid(...Object.values(POST_CATEGORY))
      .optional(),
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

// Template Validator
export class CreateTemplateValidator extends BaseValidator<CreateTemplateDto> {
  protected schema = Joi.object<CreateTemplateDto>({
    name: Joi.string().min(1).max(100).required().messages({
      "string.min": "템플릿 이름은 최소 1자 이상이어야 합니다.",
      "string.max": "템플릿 이름은 최대 100자 이하여야 합니다.",
      "any.required": "템플릿 이름은 필수입니다.",
    }),
    content: Joi.string().min(10).max(5000).required().messages({
      "string.min": "템플릿 내용은 최소 10자 이상이어야 합니다.",
      "string.max": "템플릿 내용은 최대 5000자 이하여야 합니다.",
      "any.required": "템플릿 내용은 필수입니다.",
    }),
    category: Joi.string()
      .valid(...Object.values(POST_CATEGORY))
      .required()
      .messages({
        "any.required": "카테고리는 필수입니다.",
        "any.only": "유효하지 않은 카테고리입니다.",
      }),
    isPublic: Joi.boolean().default(false),
  });
}

// GetPublicTemplates Validator
export class GetPublicTemplatesValidator extends PaginationValidator {
  protected schema = Joi.object<GetPublicTemplatesDto>({
    ...commonPaginationSchema,
    category: Joi.string()
      .valid(...Object.values(POST_CATEGORY))
      .optional()
      .messages({
        "any.only": "유효하지 않은 카테고리입니다.",
      }),
  });
}

// GetMyTemplates Validator
export class GetMyTemplatesValidator extends PaginationValidator {
  protected schema = Joi.object<GetMyTemplatesDto>(commonPaginationSchema);
}

// GetMyFavoriteTemplates Validator
export class GetMyFavoriteTemplatesValidator extends PaginationValidator {
  protected schema = Joi.object<GetMyFavoriteTemplatesDto>(
    commonPaginationSchema
  );
}

export const createPostValidator = new CreatePostValidator();
export const createTemplateValidator = new CreateTemplateValidator();
export const getPublicTemplatesValidator = new GetPublicTemplatesValidator();
export const getMyTemplatesValidator = new GetMyTemplatesValidator();
export const getMyFavoriteTemplatesValidator =
  new GetMyFavoriteTemplatesValidator();
