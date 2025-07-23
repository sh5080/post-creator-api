import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { FastifyRequest } from "fastify";

@Injectable()
export class MultipartInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    // multipart/form-data인 경우에만 처리
    if (request.headers["content-type"]?.includes("multipart/form-data")) {
      const fields: any = {};
      const files: any[] = [];

      // 모든 필드와 파일을 읽어서 객체로 변환
      for await (const part of request.parts()) {
        if (part.type === "field") {
          fields[part.fieldname] = part.value;
        } else if (part.type === "file") {
          const buffer = await part.toBuffer();
          files.push({
            fieldname: part.fieldname,
            originalname: part.filename,
            encoding: part.encoding,
            mimetype: part.mimetype,
            buffer: buffer,
            size: buffer.length,
          });
        }
      }
      // request.body에 필드 데이터 설정
      request.body = fields;
      (request as any).files = files;
    }
    return next.handle();
  }
}
