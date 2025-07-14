import { env } from "@common/configs/env.config";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import { RefreshToken } from "@common/models/refreshToken.model";
import { Types } from "mongoose";

interface TokenPayload {
  userId: string;
  nickname: string;
  role: string;
}

export async function generateAccessToken(
  payload: TokenPayload
): Promise<string> {
  return jwt.sign(payload, env.AUTH.JWT_SECRET, {
    expiresIn: `${env.AUTH.ACCESS_TOKEN_EXPIRES_IN}s` as StringValue,
  });
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const token = jwt.sign({ userId }, env.AUTH.JWT_SECRET, {
    expiresIn: `${env.AUTH.REFRESH_TOKEN_EXPIRES_IN}d` as StringValue,
  });

  // RTR: 기존 리프레시 토큰 폐기
  await RefreshToken.updateMany(
    { userId: new Types.ObjectId(userId), isRevoked: false },
    { isRevoked: true }
  );

  // 새로운 리프레시 토큰 저장
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 14); // 14일 후 만료

  await RefreshToken.create({
    userId,
    token,
    expiresAt,
    isRevoked: false,
  });

  return token;
}

export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  return jwt.verify(token, env.AUTH.JWT_SECRET) as TokenPayload;
}

export async function verifyRefreshToken(
  token: string
): Promise<string | null> {
  try {
    // 토큰 유효성 검증
    const decoded = jwt.verify(token, env.AUTH.JWT_SECRET) as {
      userId: string;
    };

    // DB에서 리프레시 토큰 확인
    const refreshToken = await RefreshToken.findOne({
      token,
      isRevoked: false,
    });

    if (!refreshToken) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await RefreshToken.updateOne({ token }, { isRevoked: true });
}
