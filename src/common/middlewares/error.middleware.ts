import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import { FastifyReply } from "fastify";
import { Logger } from "nestjs-pino";

import { ResponseStatus, ReturnResponse } from "@common/types/response.type";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception;
    this.logger.error(message);
    console.error(message);
    const jsonRes: ReturnResponse = {
      status: ResponseStatus.ERROR,
      message,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;

      if (message.message.includes("JSON at position")) {
        message.message = "관리자에게 문의 바랍니다.";
      }

      if (Array.isArray(message.message)) {
        jsonRes.message = message.message[0];
      } else {
        jsonRes.message = message.message;
      }
    } else {
      jsonRes.message = "일시적인 오류입니다.";
    }

    return response.status(status).send(jsonRes);
  }
}
