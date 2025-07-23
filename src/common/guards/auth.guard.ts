import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import jwt from "jsonwebtoken";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
} from "@common/utils/jwt.util";
import { sendAuthTokens } from "@common/utils/token.util";
import { UserRepository } from "@user/user.repository";
import { AuthRequest } from "@common/types/request.type";

@Injectable()
export class AuthGuard implements CanActivate {
  private userRepository = new UserRepository();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader = request.headers.authorization;
    const refreshToken = request.cookies?.refreshToken;

    if (!authHeader) {
      throw new UnauthorizedException("로그인 후 이용이 가능합니다.");
    }

    try {
      const accessToken = authHeader.split(" ")[1];
      const decoded = await verifyAccessToken(accessToken);
      // 요청 객체에 사용자 정보 추가
      (request as AuthRequest).user = decoded;
      return true;
    } catch (error) {
      // 액세스 토큰이 만료된 경우 리프레시 토큰으로 재발급 시도
      if (refreshToken && error instanceof jwt.TokenExpiredError) {
        try {
          const userId = await verifyRefreshToken(refreshToken);
          if (!userId) {
            throw new UnauthorizedException(
              "리프레시 토큰이 유효하지 않습니다."
            );
          }

          // 사용자 정보 조회
          const user = await this.userRepository.findById(userId);
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

          const response = context.switchToHttp().getResponse();
          await sendAuthTokens(response, newAccessToken, newRefreshToken);

          // 요청 객체에 사용자 정보 추가
          request.user = {
            userId: user.id,
            nickname: user.nickname,
          };

          return true;
        } catch (refreshError) {
          throw new UnauthorizedException(
            "토큰이 만료되었습니다. 다시 로그인해주세요."
          );
        }
      } else {
        throw new UnauthorizedException(
          "로그인 이후 서비스 이용이 가능합니다."
        );
      }
    }
  }
}

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  private userRepository = new UserRepository();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException("리프레시 토큰이 필요합니다.");
    }

    try {
      const userId = await verifyRefreshToken(refreshToken);
      if (!userId) {
        throw new UnauthorizedException("유효하지 않은 리프레시 토큰입니다.");
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UnauthorizedException("사용자를 찾을 수 없습니다.");
      }

      // 요청 객체에 사용자 정보 추가
      request.user = {
        userId: user.id,
        nickname: user.nickname,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException("리프레시 토큰 검증에 실패했습니다.");
    }
  }
}
