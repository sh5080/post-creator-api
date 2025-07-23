import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { AuthRequest } from "@common/types/request.type";
import { verifyAccessToken } from "@common/utils/jwt.util";

@Injectable()
export class ApiGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const apiHeader = request.headers["X-A-Token"];
    if (!apiHeader) {
      throw new UnauthorizedException("인증 토큰이 필요합니다.");
    }
    try {
      const apiToken = apiHeader as string;
      await verifyAccessToken(apiToken);
      return true;
    } catch (error) {
      throw new ForbiddenException("유효하지 않은 토큰입니다.");
    }
  }
}
