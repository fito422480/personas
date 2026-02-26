import { Module } from "@nestjs/common";
import { PadronController } from "./padron.controller";
import { PadronService } from "./application/padron.service";
import { TokenManager } from "../../common/token/token.manager";
import { HttpModule } from "../../common/http/http.module";
import { CacheModule } from "../../common/cache/cache.module";
import { ResilienceModule } from "../../common/resilience/resilience.module";

@Module({
  imports: [HttpModule, CacheModule, ResilienceModule],
  controllers: [PadronController],
  providers: [PadronService, TokenManager],
})
export class PadronModule {}
