import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { FastifyReply } from "fastify";
import { sendAuthTokens } from "@common/utils/token.util";

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<FastifyReply>();
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        // 요청 객체에서 토큰 정보 가져오기 (로그인 시)
        const tokens = (request as any).tokens;
        const activityToken = (request as any).activityToken;

        // req.user에서 토큰 정보 가져오기 (인증된 요청 시)
        const userTokens = (request as any).user?.tokens;
        const userActivityToken = (request as any).user?.activityToken;

        // 토큰 설정 (우선순위: req > req.user)
        const finalTokens = tokens || userTokens;
        const finalActivityToken = activityToken || userActivityToken;

        if (
          finalTokens &&
          finalTokens.accessToken &&
          finalTokens.refreshToken
        ) {
          sendAuthTokens(
            response,
            finalTokens.accessToken,
            finalTokens.refreshToken
          );
        }

        if (finalActivityToken) {
          response.header("X-A-Token", finalActivityToken);
        }
      })
    );
  }
}
