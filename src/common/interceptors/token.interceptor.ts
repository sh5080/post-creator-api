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
        const tokens = (request as any).tokens;
        sendAuthTokens(response, tokens.accessToken, tokens.refreshToken);
        const apiToken = (request as any).apiToken;
        if (apiToken) {
          response.header("X-A-Token", apiToken);
        }
      })
    );
  }
}
