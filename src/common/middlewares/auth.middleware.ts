import { Response, NextFunction } from "express";
import { AuthRequest } from "@common/types/request.type";
import { UnauthorizedException } from "@nestjs/common";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
} from "@common/utils/jwt.util";
import jwt from "jsonwebtoken";
import { sendAuthTokens } from "@common/utils/token.util";
import { UserRepository } from "@user/user.repository";
import { FastifyReply } from "fastify";
const userRepository = new UserRepository();
export const authMiddleware = async (
  req: AuthRequest,
  res: FastifyReply,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.cookies?.refreshToken;
  if (!authHeader) {
    throw new UnauthorizedException("로그인후 이용이 가능합니다.");
  }

  try {
    const accessToken = authHeader.split(" ")[1];
    const decoded = await verifyAccessToken(accessToken);
    req.user = decoded;
    next();
  } catch (error) {
    // 액세스 토큰이 만료된 경우 리프레시 토큰으로 재발급 시도
    if (refreshToken && error instanceof jwt.TokenExpiredError) {
      try {
        const userId = await verifyRefreshToken(refreshToken);
        if (!userId) {
          throw new UnauthorizedException("리프레시 토큰이 유효하지 않습니다.");
        }

        // 사용자 정보 조회
        const user = await userRepository.findById(userId);
        if (!user) {
          throw new UnauthorizedException("사용자를 찾을 수 없습니다.");
        }

        // RTR: 새로운 토큰 쌍 발급
        const newAccessToken = await generateAccessToken({
          userId: user.id,
          nickname: user.nickname,
        });
        const newRefreshToken = await generateRefreshToken(user.id);

        // 이전 리프레시 토큰 폐기
        await revokeRefreshToken(refreshToken);
        await sendAuthTokens(res, newAccessToken, newRefreshToken);
        req.user = {
          userId: user.id,
          nickname: user.nickname,
        };

        next();
      } catch (refreshError) {
        throw new UnauthorizedException(
          "토큰이 만료되었습니다. 다시 로그인해주세요."
        );
      }
    } else {
      throw new UnauthorizedException("로그인 이후 서비스 이용이 가능합니다.");
    }
  }
};

// 리프레시 토큰 검증 미들웨어
export const validateRefreshToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedException("리프레시 토큰이 필요합니다.");
  }

  try {
    const userId = await verifyRefreshToken(refreshToken);
    if (!userId) {
      throw new UnauthorizedException("유효하지 않은 리프레시 토큰입니다.");
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException("사용자를 찾을 수 없습니다.");
    }

    req.user = {
      userId: user.id,
      nickname: user.nickname,
    };

    next();
  } catch (error) {
    throw new UnauthorizedException("리프레시 토큰 검증에 실패했습니다.");
  }
};
