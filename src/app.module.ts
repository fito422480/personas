import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { AuthModule } from "./auth/auth.module";
import { PadronModule } from "./modules/padron/padron.module";
import { HttpModule } from "./common/http/http.module";
import { CacheModule } from "./common/cache/cache.module";
import { ResilienceModule } from "./common/resilience/resilience.module";
import configuration from "./config/configuration";
import { AppController } from "./app.controller";

const cleanEnvString = () =>
  Joi.string()
    .replace(/\\r\\n/g, "")
    .replace(/\r?\n/g, "")
    .replace(/[\\"]/g, "")
    .trim();

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        JWT_SECRET: cleanEnvString().min(12).required(),
        PLRA_TOKENS: cleanEnvString().required(),
        REDIS_URL: cleanEnvString().uri().optional(),
        REDIS_USERNAME: cleanEnvString().optional(),
        REDIS_PASSWORD: cleanEnvString().optional(),
        REDIS_HOST: cleanEnvString().optional(),
        REDIS_PORT: cleanEnvString().optional(),
      }),
    }),
    HttpModule,
    CacheModule,
    ResilienceModule,
    AuthModule,
    PadronModule,
  ],
})
export class AppModule {}
