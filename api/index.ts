import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";

let httpHandler: ((req: unknown, res: unknown) => unknown) | null = null;

async function createServer() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"],
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors();
  await app.init();

  return app.getHttpAdapter().getInstance();
}

export default async function handler(req: unknown, res: unknown) {
  if (!httpHandler) {
    httpHandler = await createServer();
  }

  const currentHandler = httpHandler!;
  return currentHandler(req, res);
}
