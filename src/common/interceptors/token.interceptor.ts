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
import { AuthRequest } from "@common/types/request.type";
@Injectable()
export class TokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<FastifyReply>();
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return next.handle().pipe(
      tap(() => {
        // 요청 객체에서 토큰 정보 가져오기
        const tokens = request.user!.tokens;
        const activityToken = request.user!.activityToken;

        if (tokens && tokens.accessToken && tokens.refreshToken) {
          sendAuthTokens(response, tokens.accessToken, tokens.refreshToken);
        }

        if (activityToken) {
          response.header("X-A-Token", activityToken);
        }
      })
    );
  }
}
