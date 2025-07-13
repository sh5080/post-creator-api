import { Request, Response, NextFunction } from "express";
import { ErrorResponse, HttpException } from "@common/types/response.type";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof HttpException) {
    const response: ErrorResponse = {
      statusCode: error.status,
      message: error.message,
    };
    res.status(error.status).json(response);
    return;
  }

  // 기본 에러 응답
  const response: ErrorResponse = {
    statusCode: 500,
    message: "Internal Server Error",
  };

  res.status(500).json(response);
};
