// import "module-alias/register";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { env } from "@common/configs/env.config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  app.enableCors({
    origin: [env.SERVER.FRONT_URL, "http://localhost:5173"],
    credentials: true,
    exposedHeaders: ["Authorization", "refreshToken", "X-A-Token"],
  });
  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
}

bootstrap();
