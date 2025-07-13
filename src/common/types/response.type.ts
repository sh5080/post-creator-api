export interface ErrorResponse {
  statusCode: number;
  message: string;
  details?: string;
}

export class HttpException extends Error {
  public status: number;
  public code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "HttpException";
  }
}

export class BadRequestException extends HttpException {
  constructor(message = "Bad Request", code?: string) {
    super(400, message, code);
    this.name = "BadRequestException";
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized", code?: string) {
    super(401, message, code);
    this.name = "UnauthorizedException";
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden", code?: string) {
    super(403, message, code);
    this.name = "ForbiddenException";
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Not Found", code?: string) {
    super(404, message, code);
    this.name = "NotFoundException";
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message = "Internal Server Error", code?: string) {
    super(500, message, code);
    this.name = "InternalServerErrorException";
  }
}
