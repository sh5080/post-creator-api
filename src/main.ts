import "module-alias/register";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { env } from "@common/configs/env.config";
import multipart from "@fastify/multipart";
import cookie from "@fastify/cookie";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  // Fastify 인스턴스 가져오기
  const fastifyInstance = app.getHttpAdapter().getInstance();

  // Fastify multipart 플러그인 등록
  await fastifyInstance.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 5, // 최대 5개 파일
    },
  });

  // Fastify cookie 플러그인 등록
  await fastifyInstance.register(cookie);

  app.enableCors({
    origin: [env.SERVER.FRONT_URL, "http://localhost:5173"],
    credentials: true,
    exposedHeaders: ["Authorization", "refreshToken", "X-A-Token"],
  });

  const port = process.env.PORT || 3000;
  if (process.env.NODE_ENV === "production") {
    const host = process.env.DOCKER_HOST || "0.0.0.0";
    await app.listen(port, host);
    console.log(`Server listening on ${host}:${port}`);
  } else {
    await app.listen(port);
    console.log(`Server listening on http://localhost:${port}`);
  }
}

bootstrap();
