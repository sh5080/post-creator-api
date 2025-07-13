import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, UserPayload } from "@common/types/request.type";
import {
  BadRequestException,
  UnauthorizedException,
} from "@common/types/response.type";
import { env } from "@common/configs/env.config";

const JWT_SECRET = env.AUTH.JWT_SECRET;

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedException("인증이 필요합니다.");
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as UserPayload;
    next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      throw new BadRequestException("유효하지 않은 토큰입니다.");
    }
    throw error;
  }
};
