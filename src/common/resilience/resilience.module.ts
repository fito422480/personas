import { Module } from "@nestjs/common";
import { RetryService } from "./retry.service";
import { CircuitBreakerService } from "./circuit-breaker.service";

@Module({
  providers: [RetryService, CircuitBreakerService],
  exports: [RetryService, CircuitBreakerService],
})
export class ResilienceModule {}
