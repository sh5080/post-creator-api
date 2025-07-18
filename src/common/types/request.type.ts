import { Request } from "express";

export interface UserPayload {
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  activityToken?: string;
  userId: string;
  nickname: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface BlogPostRequest {
  clientRequestPrompt: string;
  keywords: string[];
  keywordCount: number;
}
