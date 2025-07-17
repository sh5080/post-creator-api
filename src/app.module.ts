import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { UserModule } from "@user/user.module";
import { AuthModule } from "@auth/auth.module";
import { PostModule } from "@post/post.module";
import { GlobalExceptionFilter } from "@common/middlewares/error.middleware";
import { ResponseInterceptor } from "@common/interceptors/response.interceptor";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { LoggerModule } from "nestjs-pino";
import { pinoHttpOptions } from "@common/utils/pino.util";

@Module({
  imports: [
    UserModule,
    AuthModule,
    PostModule,
    LoggerModule.forRoot({ pinoHttp: pinoHttpOptions }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
