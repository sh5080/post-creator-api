import { Request } from "express";

export interface UserPayload {
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export interface BlogPostRequest {
  clientRequestPrompt: string;
  keywords: string[];
  keywordCount: number;
}

export interface CredentialRequest {
  email: string;
  password: string;
  role: string;
}
