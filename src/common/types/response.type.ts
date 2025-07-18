import { FastifyReply } from "fastify";

export const ResponseStatus = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type ResponseStatus =
  (typeof ResponseStatus)[keyof typeof ResponseStatus];
export interface ErrorResponse {
  statusCode: number;
  message: string;
  details?: string;
}

export interface ReturnResponse {
  status: ResponseStatus;
  message: string;
}

export interface AuthResponse extends FastifyReply {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  activityToken: string;
}
