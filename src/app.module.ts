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

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().min(12).required(),
        PLRA_TOKENS: Joi.string().required(),
        REDIS_URL: Joi.string().uri().optional(),
        REDIS_USERNAME: Joi.string().optional(),
        REDIS_PASSWORD: Joi.string().optional(),
        REDIS_HOST: Joi.string().hostname().optional(),
        REDIS_PORT: Joi.number().port().default(6379),
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
