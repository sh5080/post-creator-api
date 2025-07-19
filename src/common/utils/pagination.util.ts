import { PaginationQuery } from "@common/types/request.type";

export interface PaginationResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * 페이지네이션 응답을 정규화하는 유틸리티 함수
 * @param data - 페이지네이션된 데이터 배열
 * @param page - 현재 페이지 번호
 * @param limit - 페이지당 아이템 수
 * @returns 정규화된 페이지네이션 응답
 */
export function normalizePaginationResponse<T>(
  data: T[],
  page: number,
  limit: number
): PaginationResponse<T> {
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const currentPage = page || 1;

  return {
    items: data,
    pagination: {
      total,
      page: currentPage,
      limit,
      totalPages,
    },
  };
}

/**
 * DTO에서 페이지네이션 정보를 추출하여 정규화된 응답 생성
 * @param data - 페이지네이션된 데이터 배열
 * @param dto - 페이지네이션 DTO (page, limit 포함)
 * @returns 정규화된 페이지네이션 응답
 */
export function createPaginationResponse<T>(
  data: T[],
  dto: PaginationQuery
): PaginationResponse<T> {
  const { page = 1, limit = 10 } = dto;
  return normalizePaginationResponse(data, page, limit);
}
