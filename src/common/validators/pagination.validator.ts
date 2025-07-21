import Joi from "joi";
import { BaseValidator } from "./base.validator";
import { PaginationQuery } from "@common/types/request.type";

export class PaginationValidator extends BaseValidator<PaginationQuery> {
  protected schema = Joi.object<PaginationQuery>({
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "페이지 번호는 숫자여야 합니다.",
      "number.integer": "페이지 번호는 정수여야 합니다.",
      "number.min": "페이지 번호는 1 이상이어야 합니다.",
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      "number.base": "페이지 크기는 숫자여야 합니다.",
      "number.integer": "페이지 크기는 정수여야 합니다.",
      "number.min": "페이지 크기는 1 이상이어야 합니다.",
      "number.max": "페이지 크기는 100 이하여야 합니다.",
    }),
  });
}

// 공통 페이지네이션 + 정렬 스키마
export const commonPaginationSchema = {
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "페이지 번호는 숫자여야 합니다.",
      "number.integer": "페이지 번호는 정수여야 합니다.",
      "number.min": "페이지 번호는 1 이상이어야 합니다.",
    })
    .required(),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      "number.base": "페이지 크기는 숫자여야 합니다.",
      "number.integer": "페이지 크기는 정수여야 합니다.",
      "number.min": "페이지 크기는 1 이상이어야 합니다.",
      "number.max": "페이지 크기는 100 이하여야 합니다.",
    })
    .required(),
  sort: Joi.string().valid("latest", "popular").default("latest").messages({
    "any.only": "정렬 방식은 'latest' 또는 'popular'여야 합니다.",
  }),
};

export const paginationValidator = new PaginationValidator();
