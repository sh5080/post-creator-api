import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ResponseStatus } from "@common/types/response.type";

export interface Response<T> {
  data: T;
  status: ResponseStatus;
  message: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: ResponseStatus.SUCCESS,
        message: "요청이 성공적으로 처리되었습니다.",
        data,
      }))
    );
  }
}
